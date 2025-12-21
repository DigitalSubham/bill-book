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
  const busi = {
    name: business.name,
    address: business.address,
    mobile: business.mobile,
    email: business.email,
    gst_number: business.gst_number,
    pan: business.pan_number,

    bankName: business.bank,
    ifsc: business.ifsc,
    accountNumber: business.account_no,

    upiId: business.upi_id,
    qrCode: qrcode,
  };

  const inv = {
    invoiceNo: invoice.invoice_number,
    invoiceDate: invoice.invoice_date,
    dueDate: invoice.due_date,

    customerName: invoice.customer.name,
    customerAddress: invoice.customer.address,
    customerGST: invoice.customer.gst_number,
    customerMobile: invoice.customer.mobile,
    placeOfSupply: invoice.customer.address,
    items: invoice.items,
    taxableAmount: invoice.total_amount - invoice.total_tax,
    cgst: invoice.cgst || invoice.cgst_total,
    sgst: invoice.sgst || invoice.sgst_total,
    totalTax: invoice.total_tax || invoice.totalAmount - invoice.taxableAmount,
    totalAmount: invoice.totalAmount || invoice.total_amount,
    receivedAmount: invoice.receivedAmount,

    totalAmountWords: convertAmountToWords(invoice.total_amount),
  };

  console.log('inv', invoice);

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
