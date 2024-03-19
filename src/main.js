import { PDFDocument } from 'pdf-lib';
import downloadjs from 'downloadjs';
import SignaturePad from 'signature_pad';

const COUNTRY = 'SPAIN';
const BROKER = 'Interactive Brokers Ireland Limited';

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function getStrDate() {
  const d = new Date();
  return d.toLocaleString('en-us', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/(\d+)\/(\d+)\/(\d+)/, '$2-$1-$3').replaceAll('-','');
}

async function fillForm(name, address, dni, signatureBytes) {
  const formUrl = 'assets/files/form-8-3-6-interest-withholding-tax.pdf';
  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();
  const nameField = form.getTextField('Name of person');
  nameField.setText(name);

  const addressField = form.getTextField('Address of person');
  addressField.setText(address);

  const dniField = form.getTextField('Tax reference number in country of residence where relevant');
  dniField.setText(dni);

  const taxResidentCountryField = form.getTextField('tax resident in');
  taxResidentCountryField.setText(COUNTRY);

  const taxNumberField = form.getTextField('tax at a rate not to exceed');
  taxNumberField.setText('0');

  const certificateOfResidenceField = form.getCheckBox('Attaching certificate of residence T');
  certificateOfResidenceField.check();

  const doubleTaxationCountryField = form.getTextField('B  I confirm that the Interest Article of Irelands Double Taxation Agreement with');
  doubleTaxationCountryField.setText(COUNTRY);

  const personInterestField = form.getTextField('insert name of person making the interest');
  personInterestField.setText(BROKER);

  const writtenNoticeField = form.getTextField('written notice');
  writtenNoticeField.setText(BROKER);

  const dateField = form.getTextField('Text1');
  dateField.setText(getStrDate());

  const pngImage = await pdfDoc.embedPng(signatureBytes);

  const pngDims = pngImage.scale(0.6);

  const page = pdfDoc.getPage(0);

  page.drawImage(pngImage, {
    x: 160.0,
    y: 285.0,
    width: pngDims.width,
    height: pngDims.height,
  });

  return await pdfDoc.save();
}

export function createSignaturePad() {
  return new SignaturePad(document.getElementById('signature-pad'), {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    penColor: 'rgb(0, 0, 0)'
  });
}

export async function merge(name, address, dni, residenceFile, signatureBytes) {
  const formBytes = await fillForm(name, address, dni, signatureBytes);
  const mergePdf = await PDFDocument.load(formBytes);

  const aeatBytes = await readFileAsync(residenceFile);
  const aeatPdf = await PDFDocument.load(aeatBytes);

  const copiedPagesB = await mergePdf.copyPages(aeatPdf, aeatPdf.getPageIndices());
  copiedPagesB.forEach((page) => mergePdf.addPage(page));

  const mergedPdfFile = await mergePdf.save();

  downloadjs(mergedPdfFile, 'form-8-3-6.pdf', 'application/pdf');
}
