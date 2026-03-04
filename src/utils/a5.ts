import { currency, safe } from './helper';

export const A5htmlTemplate = (invoice: any = {}, business: any = {}) => {
  const renderItems = () => {
    if (!invoice.items?.length) {
      return `<tr><td colspan="7" style="text-align:center;">No items</td></tr>`;
    }

    return invoice.items
      .map((it: any, idx: number) => {
        /* CHANGED: 21 -> 15 items per page */
        const pageBreak = idx > 0 && idx % 15 === 0;

        return `
          ${pageBreak ? `<tr style="page-break-before:always"></tr>` : ''}
          <tr>
              <td>${idx + 1}</td>
              <td>${safe(it.productName)}</td>
              <td class="c-qty">${safe(it.quantity)}</td>
              <td>${currency(it.mrp)}</td>
              <td>${currency(it.sellingRate)}</td>
              <td>${currency(it.taxAmount)} (${safe(it.taxRate)}%)</td>
              <td>${currency(it.amount)}</td>
          </tr>
        `;
      })
      .join('');
  };

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Invoice</title>

<style>

/* CHANGED: A4 -> A5 */
@page {
  size: 148mm 210mm;
  margin: 2mm;
}

/* CHANGED: smaller font */
html,body {
width: 148mm;
  height: 210mm;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 8.5px;
  line-height: 1.15;
  color: #000;
  margin: 0;
  padding: 0;
}

.container { padding: 0px; } /* CHANGED */

/* CHANGED: smaller company title */
.company {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
}

/* CHANGED */
.comp-address {
  font-size: 8px;
  line-height: 1.2;
  margin-top: 2px;
}

.addr-row { margin-top: 2px; }

.value { margin-right: 0px; }
.sep { margin: 0 2px; color: #000; }

/* CHANGED */
.signature {
  margin-top: 15px;
  text-align: right;
  font-size: 8.5px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* CHANGED */
.invoice-title-right {
  font-weight: 700;
  font-size: 10px;
  text-transform: uppercase;
  text-align: right;
  white-space: nowrap;
}

/* CHANGED: smaller padding */
.box {
  border: 1px solid #000;
  padding: 3px;
  font-size: 8.5px;
  line-height: 1.2;
}

.two-cols {
  display: flex;
  gap: 4px;
  margin-top: 3px;
}

.col { flex: 1; }

/* CHANGED */
table.items {
  width: 100%;
  border-collapse: collapse;
  margin-top: 5px;
  table-layout: fixed;
  font-size: 8.5px;
}

/* CHANGED */
table.items th,
table.items td {
  border: 1px solid #000;
  padding: 2px 3px;
}

/* CHANGED */
table.items th {
  background: #f2f2f2;
  font-weight: 700;
}

thead { display: table-header-group; }

/* NEW: fixed row height to fit 15 rows */
table.items tr {
  height: 14px;
}

tr { page-break-inside: avoid; }

.c-sno { width: 5%; }

/* NEW: prevent long names breaking row */
.c-item {
  width: 43%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.c-qty {
  width: 7%;
  text-align: center;
}

.c-mrp,
.c-rate,
.c-tax,
.c-amt {
  width: 11%;
  text-align: right;
}

.section-safe { page-break-inside: avoid; }

/* CHANGED */
.bank {
  width: 100%;
  padding: 4px 0;
  font-size: 8.5px;
  margin-top: 4px;
  page-break-inside: avoid;
}

.bank-flex {
  display: grid;
  grid-template-columns: 0.7fr 0.95fr;
  gap: 10px;
}

.bank-left {
  padding-right: 10px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

/* CHANGED */
.qr img {
  width: 55px;
  height: 55px;
}

.amount-box {
  margin-right: 4px;
  padding-right: 8px;
  text-align: right;
  line-height: 1.25;
}

.amount-row { margin-top: 2px; }

.amount-row .label {
  font-weight: 700;
  margin-right: 4px;
}

.amount-row.total {
  margin-top: 3px;
  font-weight: 700;
}

/* CHANGED */
.bank-title {
  font-weight: 700;
  font-size: 9px;
  margin-bottom: 2px;
  text-transform: uppercase;
}

.bank-row { margin-top: 2px; }

.total-words {
  margin-top: 5px;
  font-weight: 700;
  text-align: right;
  margin-right: 10px;
}

.label {
  font-weight: 700;
}
.page {
  width: 148mm;
  height: 210mm;
}

</style>
</head>

<body>
<div class="page">
<div class="container">

<div class="header-row">
  <div>
    <div class="company">${safe(business.name)}</div>
    <div class="comp-address">
      <div class="addr-row">${safe(business.address)}</div>
      <div class="addr-row">
        <span class="label">Mob:</span> ${safe(business.mobile)}
        <span class="sep">|</span>
        <span class="label">Email:</span> ${safe(business.email)}
      </div>
      <div class="addr-row">
        <span class="label">GSTIN:</span> ${safe(business.gst_number)}
        <span class="sep">|</span>
        <span class="label">PAN:</span> ${safe(business.pan)}
      </div>
    </div>
  </div>

  <div class="invoice-title-right">
  TAX INVOICE : ${safe(invoice.invoiceNumber)}
  
  <div style="padding-top:12px;"> <!-- CHANGED -->
  <b>Date:</b> ${invoice.invoiceDate} &nbsp;
  <b>Due:</b> ${invoice.dueDate}
</div>
  </div>
</div>


<div class="two-cols">
  <div class="col">
    <div class="box">
      <b>BILL TO</b><br/>
      ${safe(invoice.customerName)}<br/>
      <b>GSTIN:</b> ${safe(invoice.customerGST)}<br/>
      <b>Mob:</b> ${safe(invoice.customerMobile)}<br/>
      <b>POS:</b> ${safe(invoice.placeOfSupply)}
    </div>
  </div>

  <div class="col">
    <div class="box">
      <b>SHIP TO</b><br/>
      ${safe(invoice.customerName)}<br/>
      ${safe(invoice.customerAddress)}
    </div>
  </div>
</div>


<table class="items">
<thead>
<tr>
  <th class="c-sno">#</th>
  <th class="c-item">ITEM</th>
  <th class="c-qty">QTY</th>
  <th class="c-mrp">MRP</th>
  <th class="c-rate">RATE</th>
  <th class="c-tax">TAX</th>
  <th class="c-amt">AMOUNT</th>
</tr>
</thead>
<tbody>
${renderItems()}
</tbody>
</table>


<div class="bank section-safe">

  <div class="bank-flex">

    <div class="bank-left">
      <div>
        <div class="bank-title">BANK & PAYMENT DETAILS</div>
        <div class="bank-row">${safe(business.bankName)}</div>
        <div class="bank-row"><span class="label">A/C:</span> ${safe(
          business.accountNumber,
        )}</div>
        <div class="bank-row"><span class="label">IFSC:</span> ${safe(
          business.ifsc,
        )}</div>
        <div class="bank-row"><span class="label">UPI:</span> ${safe(
          business.upiId,
        )}</div>
      </div>

      ${
        business.qrCode
          ? `<div class="qr"><img src="${business.qrCode}" alt="QR Code" /></div>`
          : ''
      }

    </div>

<div class="amount-box">

<div class="amount-row">
Subtotal: ${currency(invoice.subtotal)}
</div>

${
  Number(invoice?.discountAmount ?? 0) > 0
    ? `<div class="amount-row">Discount: ${currency(
        invoice.discountAmount,
      )}</div>`
    : ''
}

<div class="amount-row">
Taxable: ${currency(invoice.taxableAmount)}
</div>

<div class="amount-row">
CGST: ${currency(invoice.cgstTotal)}
</div>

<div class="amount-row">
SGST: ${currency(invoice.sgstTotal)}
</div>

<div class="amount-row total">
Total: ${currency(invoice.totalAmount)}
</div>

${
  Number(invoice?.receivedAmount ?? 0) > 0
    ? `<div class="amount-row">Received: ${currency(
        invoice.receivedAmount,
      )}</div>`
    : ''
}

</div>

</div>

</div>


<div class="total-words">
${safe(invoice.totalAmountWords)}
</div>


<div class="signature">
For ${safe(business.name)} <br/><br/>
Authorized Signatory
</div>

</div>
</div>
</body>
</html>`;
};
