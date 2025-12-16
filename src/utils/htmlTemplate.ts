import { dateFmt } from './calculations';

export const htmlTemplate = (invoice: any, business: any) => {
  const format = (v: number) => (typeof v === 'number' ? v.toFixed(2) : v);

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice</title>
  <style>
    @page { size: A4; margin: 18mm 12mm; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      color: #000;
      margin: 0;
      padding: 0;
    }

    .container { padding: 14px; }

    /* Header */
    .header { text-align: left; margin-bottom: 6px; }
    .company {
      font-size: 18px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .comp-address { font-size: 11px; line-height: 1.35; margin-top:6px; }

    .meta-row {
      display:flex;
      width:100%;
      justify-content: space-between;
      margin-top: 8px;
    }

    /* Title */
    .invoice-title {
      text-align:center;
      font-weight:700;
      margin: 10px 0 6px 0;
      font-size: 14px;
      text-transform: uppercase;
    }

    /* Info boxes */
    .box {
      border: 1px solid #000;
      padding: 8px;
      font-size: 11px;
      line-height: 1.35;
    }
    .two-cols { display:flex; gap:12px; margin-top:10px; }
    .col { flex:1; }

    /* Items table */
    table.items {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      table-layout: fixed;
      font-size: 11px;
    }
    table.items th, table.items td {
      border: 1px solid #000;
      padding: 6px 6px;
      vertical-align: top;
      word-wrap: break-word;
    }
    table.items th {
      background: #f7f7f7;
      font-weight: 700;
      text-align: left;
      font-size: 11px;
    }

    /* column widths (approx to match PDF) */
    .c-sno { width:6%; }
    .c-item { width:44%; }
    .c-qty { width:8%; text-align:center; }
    .c-mrp { width:10%; text-align:right; }
    .c-rate { width:10%; text-align:right; }
    .c-tax { width:10%; text-align:right; }
    .c-amt { width:12%; text-align:right; }

    /* Subtotal and bank/qr areas */
    .summary {
      margin-top: 12px;
      display:flex;
      justify-content: space-between;
      gap: 12px;
    }
    .bank {
      border: 1px solid #000;
      padding: 8px;
      width: 60%;
      font-size: 11px;
    }
    .qr {
      width: 35%;
      text-align:center;
      font-size: 11px;
    }
    .qr img { width: 140px; height: 140px; object-fit: contain; margin-top:8px; }

    .amount-box {
      margin-top: 12px;
      float: right;
      width: 38%;
      font-size: 11px;
      line-height: 1.6;
      text-align: right;
    }
    .amount-box b { font-weight:700; }

    .total-words { margin-top: 18px; font-weight:700; font-size: 11px; }

    .terms {
      margin-top: 14px;
      font-size: 11px;
      line-height: 1.4;
    }

    /* Clear floats */
    .clear { clear: both; }

    /* Small print */
    .small { font-size: 10px; }

  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="company">${business.name || ''}</div>
      <div class="comp-address">
        ${business.address || ''} <br/>
        Mobile : ${business.mobile || ''} <br/>
        Email : ${business.email || ''} <br/>
        GSTIN : ${business.gst_number || ''} <br/>
        PAN Number : ${business.pan || ''}
      </div>
    </div>

    <div class="invoice-title">TAX INVOICE ORIGINAL FOR RECIPIENT</div>

    <!-- Invoice meta -->
    <div>
      <table style="width:100%; border-collapse: collapse; font-size:11px;">
        <tr>
          <td style="border:0; padding:0;">
            <div style="display:flex; gap:12px;">
              <div style="min-width:33%;"><b>Invoice No.</b> ${
                invoice.invoiceNo || ''
              }</div>
              <div style="min-width:33%;"><b>Invoice Date</b> ${dateFmt(
                invoice.invoiceDate,
              )}</div>
              <div style="min-width:33%;"><b>Due Date</b> ${dateFmt(
                invoice.dueDate,
              )}</div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Bill To / Ship To -->
    <div class="two-cols">
      <div class="col">
        <div class="box">
          <strong>BILL TO</strong><br/>
          ${invoice.customerName || ''}<br/>
          ${invoice.customerAddress || ''}<br/>
          Mobile : ${invoice.customerMobile || ''}<br/>
          Place of Supply : ${invoice.placeOfSupply || ''}
        </div>
      </div>

      <div class="col">
        <div class="box">
          <strong>SHIP TO</strong><br/>
          ${invoice.customerName || ''}<br/>
          ${invoice.customerAddress || ''}
        </div>
      </div>
    </div>

    <!-- Items table -->
    <table class="items" aria-labelledby="items">
      <thead>
        <tr>
          <th class="c-sno">S.NO.</th>
          <th class="c-item">ITEMS</th>
          <th class="c-qty">QTY.</th>
          <th class="c-mrp">MRP</th>
          <th class="c-rate">RATE</th>
          <th class="c-tax">TAX</th>
          <th class="c-amt">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        ${
          invoice.items && invoice.items.length
            ? invoice.items
                .map((it: any, idx: number) => {
                  const taxTxt = it.taxRate ? `${it.taxRate}%` : '';
                  return `<tr>
                  <td class="c-sno">${idx + 1}</td>
                  <td class="c-item">${it.productName || ''}</td>
                  <td class="c-qty" style="text-align:center">${
                    it.quantity || ''
                  }</td>
                  <td class="c-mrp" style="text-align:right">₹${format(
                    it.mrp || 0,
                  )}</td>
                  <td class="c-rate" style="text-align:right">₹${format(
                    it.rate || it.selling_rate || 0,
                  )}</td>
                  <td class="c-tax" style="text-align:right">${taxTxt}<br/>₹${format(
                    it.taxAmount || 0,
                  )}</td>
                  <td class="c-amt" style="text-align:right">₹${format(
                    it.amount || 0,
                  )}</td>
                </tr>`;
                })
                .join('')
            : `<tr><td colspan="7" style="padding:14px; text-align:center;">No items</td></tr>`
        }
      </tbody>
    </table>

    <!-- Subtotal line (like original) -->
    <div style="margin-top:8px; font-size:11px;">
      <strong>SUBTOTAL</strong>
      <div style="margin-top:6px;">
        Qty: ${
          invoice.items ? invoice.items.length : 0
        } &nbsp;&nbsp;&nbsp; Tax: ₹${format(
    invoice.totalTax || 0,
  )} &nbsp;&nbsp;&nbsp; Total: ₹${format(invoice.totalAmount || 0)}
      </div>
    </div>

    <div class="summary">
      <div class="bank">
        <strong>BANK DETAILS</strong><br/>
        Name: ${business.bankName || ''} <br/>
        IFSC Code: ${business.ifsc || ''} <br/>
        Account No: ${business.accountNumber || ''} <br/>
        Bank: ${business.bankBranch || ''}
      </div>

      <div class="qr">
        <strong>PAYMENT QR CODE</strong><br/>
        <div style="margin-top:6px;">
          ${business.qrCode ? `<img src="${business.qrCode}" alt="QR"/>` : ''}
        </div>
        <div style="margin-top:8px; font-size:11px;">
          UPI ID:<br/>${business.upiId || ''}
        </div>
      </div>
    </div>

    <!-- Amount block (right) -->
    <div class="amount-box">
      Taxable Amount: ₹${format(invoice.taxableAmount || 0)}<br/>
      CGST: ₹${format(invoice.cgst || 0)}<br/>
      SGST: ₹${format(invoice.sgst || 0)}<br/>
      <div style="margin-top:6px;"><b>Total Amount: ₹${format(
        invoice.totalAmount || 0,
      )}</b></div>
      Received Amount: ₹${format(invoice.receivedAmount || 0)}
    </div>

    <div class="clear"></div>

    <div class="total-words">${invoice.totalAmountWords || ''}</div>

    <div class="terms">
      <strong>TERMS AND CONDITIONS</strong><br/>
      please check stock properly before taking the stock<br/>
      DEMAGE will not 🚫 taken back
    </div>

  </div>
</body>
</html>
`;
};
