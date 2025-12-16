import * as RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { Platform } from 'react-native';
import { htmlTemplate } from './htmlTemplate';
import { convertAmountToWords } from './calculations';

export const generateInvoicePDF = async (
  invoice: any,
  business: any,
  qrcode: any,
) => {
  console.log('invoicebvhjkvkjj', invoice, business);

  const busi = {
    name: business.name ?? 'Subham Store',
    address: business.address ?? 'Patna City',
    mobile: business.mobile ?? '9934646569',
    email: 'gitanjalienterprises032@gmail.com',
    gst_number: business.gst_number ?? '10FNZPS6138A1ZS',
    pan: 'FNZPS6138A',

    bankName: business.bank ?? 'Gitanjali Enterprises',
    ifsc: business.ifsc ?? 'BKID0006254',
    accountNumber: business.account_no ?? '625420110000217',
    bankBranch: '',

    upiId: business.upi_id ?? '8340753119@ybl',
    qrCode: qrcode,
  };

  const inv = {
    invoiceNo: invoice.invoice_number,
    invoiceDate: invoice.invoice_date,
    dueDate: invoice.due_date,

    customerName: invoice.customer.name ?? 'New E Kirana',
    customerAddress:
      invoice.customer.address ?? 'Near State Bank, Kiadwai Puri, Patna',
    customerMobile: invoice.customer.mobile ?? '8434861924',
    placeOfSupply: invoice.customer.address,
    items: invoice.items,
    taxableAmount: invoice.total_amount - invoice.total_tax,
    cgst: invoice.cgst_total ?? 51.53,
    sgst: invoice.sgst_total ?? 51.53,
    totalTax: invoice.total_tax ?? 103.06,
    totalAmount: invoice.total_amount ?? 2164.2,
    receivedAmount: 0,

    totalAmountWords: convertAmountToWords(invoice.total_amount),
  };

  try {
    const file = await RNHTMLtoPDF.generatePDF({
      html: htmlTemplate(inv, busi),
      fileName: `Invoice_${invoice.invoiceNo || 1}`,
      base64: true,
    });
    return file.filePath;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};

export const shareInvoicePDF = async (filePath: string) => {
  try {
    if (!filePath) {
      console.warn('❌ Cannot share: filePath is empty');
      return;
    }
    const shareUrl =
      Platform.OS === 'android' ? `file://${filePath}` : filePath;

    await Share.open({
      url: shareUrl,
      type: 'application/pdf',
      showAppsToView: true,
      failOnCancel: false,
    });
  } catch (error) {
    console.error('Share Error:', error);
  }
};
