import { currency, safe } from './helper';

export const A5htmlTemplate = (invoice: any = {}, business: any = {}) => {
  const itemCount = invoice.items?.length || 0;
  const dense = itemCount > 20;

  const renderItems = () => {
    if (!itemCount) {
      return `<tr><td colspan="7" style="text-align:center;">No items</td></tr>`;
    }

    return invoice.items
      .map((it: any, idx: number) => {
        const pageBreak = idx > 0 && idx % 20 === 0;
        return `
          ${pageBreak ? `<tr style="page-break-before:always"></tr>` : ''}
          <tr>
              <td>${idx + 1}</td>
              <td class="item-name">${safe(it.productName)}</td>
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
@page { size: 148mm 210mm; margin: ${dense ? '5mm' : '6mm'}; }

body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: ${dense ? '8.1px' : '8.8px'};
  line-height: ${dense ? '1.2' : '1.25'};
  color: #111;
  margin: 0;
  padding: 0;
  background: #fff;
}

.container {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: ${dense ? '6px' : '8px'};
}

.header-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: start;
  padding-bottom: 6px;
  border-bottom: 1px solid #d9d9d9;
}

.company {
  font-size: ${dense ? '11px' : '12px'};
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
  color: #111;
}

.comp-address {
  font-size: ${dense ? '7.4px' : '7.8px'};
  line-height: 1.3;
  margin-top: 2px;
  color: #2d2d2d;
}

.addr-row { margin-top: 1px; }
.sep { margin: 0 4px; color: #888; }
.label { font-weight: 700; }

.invoice-meta {
  min-width: ${dense ? '132px' : '142px'};
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  background: #f8f8f8;
  padding: ${dense ? '5px' : '6px'};
  text-align: right;
}

.invoice-title {
  font-size: ${dense ? '9.4px' : '10px'};
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: ${dense ? '5px' : '6px'};
}

.meta-line {
  margin-top: 1px;
  font-size: ${dense ? '7.8px' : '8.2px'};
}

.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 6px;
}

.box {
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  padding: ${dense ? '5px' : '6px'};
  font-size: ${dense ? '7.9px' : '8.2px'};
  line-height: 1.25;
}

.box-title {
  font-size: ${dense ? '7.2px' : '7.6px'};
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #5f5f5f;
  margin-bottom: 2px;
}

table.items {
  width: 100%;
  border-collapse: collapse;
  margin-top: 6px;
  table-layout: fixed;
  font-size: ${dense ? '7.6px' : '8px'};
}

table.items th,
table.items td {
  border: 1px solid #d9d9d9;
  padding: ${dense ? '2px 3px' : '3px 3px'};
  background: #fff;
}

table.items th {
  background: #f3f3f3;
  font-weight: 700;
  color: #333;
}

table.items tr:nth-child(even) td { background: #fcfcfc; }

thead { display: table-header-group; }
tr { page-break-inside: avoid; }

.c-sno { width: 5%; text-align: center; }
.c-item { width: 43%; }
.item-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.c-qty { width: 7%; text-align: center; }
.c-mrp, .c-rate, .c-tax, .c-amt { width: 11%; text-align: right; }

.bank {
  margin-top: 6px;
  border-top: 1px solid #d9d9d9;
  padding-top: ${dense ? '5px' : '6px'};
  page-break-inside: avoid;
}

.bank-flex {
  display: grid;
  grid-template-columns: 0.9fr 1fr;
  gap: 8px;
}

.bank-left {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  font-size: ${dense ? '7.8px' : '8px'};
}

.bank-title {
  font-weight: 700;
  font-size: ${dense ? '7.7px' : '8px'};
  text-transform: uppercase;
  color: #5f5f5f;
  margin-bottom: 2px;
}

.bank-row { margin-top: 1px; }
.qr img { width: ${dense ? '46px' : '52px'}; height: ${
    dense ? '46px' : '52px'
  }; }

.amount-box {
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  padding: ${dense ? '5px' : '6px'};
  background: #fafafa;
  text-align: right;
  font-size: ${dense ? '7.8px' : '8.2px'};
  line-height: 1.25;
}

.amount-row { margin-top: 2px; }
.amount-row:first-child { margin-top: 0; }
.amount-row.total {
  margin-top: 3px;
  padding-top: 3px;
  border-top: 1px dashed #bfbfbf;
  font-weight: 700;
  font-size: ${dense ? '8.5px' : '9px'};
}

.total-words {
  margin-top: 5px;
  text-align: right;
  font-weight: 700;
  font-size: ${dense ? '7.9px' : '8.2px'};
}

.signature {
  margin-top: ${dense ? '10px' : '12px'};
  text-align: right;
  font-size: ${dense ? '7.8px' : '8px'};
}
</style>
</head>

<body>
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

  <div class="invoice-meta">
    <div class="invoice-title">Tax Invoice</div>
    <div class="meta-line"><span class="label">No:</span> ${safe(
      invoice.invoiceNumber,
    )}</div>
    <div class="meta-line"><span class="label">Date:</span> ${
      invoice.invoiceDate
    }</div>
    <div class="meta-line"><span class="label">Due:</span> ${
      invoice.dueDate
    }</div>
  </div>
</div>

<div class="two-cols">
  <div class="box">
    <div class="box-title">BILL TO</div>
    ${safe(invoice.customerName)}<br/>
    <span class="label">GSTIN:</span> ${safe(invoice.customerGST)}<br/>
    <span class="label">Mob:</span> ${safe(invoice.customerMobile)}<br/>
    <span class="label">POS:</span> ${safe(invoice.placeOfSupply)}
  </div>

  <div class="box">
    <div class="box-title">SHIP TO</div>
    ${safe(invoice.customerName)}<br/>
    ${safe(invoice.customerAddress)}
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

<div class="bank">
  <div class="bank-flex">
    <div class="bank-left">
      <div>
        <div class="bank-title">Bank & Payment Details</div>
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
      <div class="amount-row">Subtotal: ${currency(invoice.subtotal)}</div>
      ${
        Number(invoice?.discountAmount ?? 0) > 0
          ? `<div class="amount-row">Discount: ${currency(
              invoice.discountAmount,
            )}</div>`
          : ''
      }
      <div class="amount-row">Taxable: ${currency(invoice.taxableAmount)}</div>
      <div class="amount-row">CGST: ${currency(invoice.cgstTotal)}</div>
      <div class="amount-row">SGST: ${currency(invoice.sgstTotal)}</div>
      <div class="amount-row total">Total: ${currency(
        invoice.totalAmount,
      )}</div>
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

<div class="total-words">${safe(invoice.totalAmountWords)}</div>

<div class="signature">
For ${safe(business.name)}<br/><br/>
Authorized Signatory
</div>

</div>
</body>
</html>`;
};
