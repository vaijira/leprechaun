// import { PDFDocument } from 'https://unpkg.com/pdf-lib@1.7.0/dist/pdf-lib.min.js';
import { PDFDocument } from 'pdf-lib';

async function fillForm() {
  const formUrl = 'assets/files/form-8-3-6-interest-withholding-tax.pdf';
  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();
  const nameField = form.getTextField('Name of person');
  nameField.setText('John Smith');

  const addressField = form.getTextField('Address of person');
  addressField.setText('Revenue street');

  const dniField = form.getTextField('Tax reference number in country of residence where relevant');
  dniField.setText('XXXXX');

  const taxResidentCountryField = form.getTextField('tax resident in');
  taxResidentCountryField.setText('SPAIN');

  const taxNumberField = form.getTextField('tax at a rate not to exceed');
  taxNumberField.setText('0');

  const certificateOfResidenceField = form.getCheckBox('Attaching certificate of residence T');
  certificateOfResidenceField.check();

  const doubleTaxationCountryField = form.getTextField('B  I confirm that the Interest Article of Irelands Double Taxation Agreement with');
  doubleTaxationCountryField.setText('SPAIN');

  const personInterestField = form.getTextField('insert name of person making the interest');
  personInterestField.setText('Interactive Brokers Ireland Limited');

  const writtenNoticeField = form.getTextField('written notice');
  writtenNoticeField.setText('Interactive Brokers Ireland Limited');

  const dateField = form.getTextField('Text1');
  dateField.setText('17032024');

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  document.getElementById('pdf').src = pdfDataUri;
}

export function main() {
  fillForm();
}