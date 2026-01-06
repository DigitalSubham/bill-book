import * as RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { Platform } from 'react-native';
import { htmlTemplate } from './htmlTemplate';
import { convertAmountToWords } from './calculations';
import { formatDate } from './helper';

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
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: formatDate(invoice.invoiceDate),
    dueDate: formatDate(invoice.dueDate),

    customerName: invoice.customer.name,
    customerAddress: invoice.customer.address,
    customerGST: invoice.customer.gst_number,
    customerMobile: invoice.customer.mobile,
    placeOfSupply: invoice.customer.address,

    items: invoice.items,

    taxableAmount:
      invoice.taxableAmount ||
      Number(invoice.totalAmount) - Number(invoice.totalTax),
    cgstTotal: invoice.cgstTotal,
    sgstTotal: invoice.sgstTotal,
    totalTax:
      Number(invoice.totalAmount) -
      Number(
        invoice.taxableAmount ||
          Number(invoice.totalAmount) - Number(invoice.totalTax),
      ),
    totalAmount: invoice.totalAmount,
    receivedAmount: invoice.receivedAmount,

    totalAmountWords: convertAmountToWords(invoice.totalAmount),
  };

  console.log('inv', invoice, inv);

  try {
    const file = await RNHTMLtoPDF.generatePDF({
      html: htmlTemplate(inv, busi),
      fileName: `Invoice_${invoice.invoiceNumber || 1}`,
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
