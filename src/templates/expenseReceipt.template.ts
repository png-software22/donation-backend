export const expenseHTML = (data) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Voucher Receipt</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }

    .receipt {
      width: 800px;
      margin: auto;
      background: #fff;
      border: 2px solid #000;
      padding: 16px;
    }

    .header {
      text-align: center;
      border-bottom: 1px solid #000;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }

    .header h2 {
      margin: 4px 0;
      font-size: 22px;
      font-weight: bold;
    }

    .header p {
      margin: 2px 0;
      font-size: 13px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin: 6px 0;
    }

    .row strong {
      font-weight: bold;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 14px;
    }

    table th,
    table td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }

    table th {
      background: #f2f2f2;
    }

    .amount {
      text-align: right;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      font-size: 14px;
    }

    .signature {
      text-align: center;
      width: 200px;
    }

    .signature-line {
      border-top: 1px solid #000;
      margin-top: 30px;
      padding-top: 4px;
    }

    @media print {
      body {
        background: none;
      }
      .receipt {
        border: 1px solid #000;
      }
    }
  </style>
</head>
<body>

  <div class="receipt">
    <!-- Header -->
    <div class="header">
      <p>|| Shree Ganeshay Namah ||</p>
      <h2>SHREE SANTOSH CHARITABLE TRUST</h2>
      <p>
        Head Office: 205, Vastu Prestige, 2nd Floor, New Link Rd,
        Above Tanishq Showroom, Andheri (W), Mumbai – 53
      </p>
      <p>
        Site Add: Village – Mahasar, Near Ateli Mandi, Tehsil – Narnaul,
        Dist. Mahendragarh, Haryana – 123021
      </p>
      <p>
        Tel: +91-22-2634 7442 / 2634 7449 |
        Office Phone: 01282-277222, 98139 27465
      </p>
    </div>

    <!-- Meta Info -->
    <div class="row">
      <div><strong>Serial No:</strong> VC00${data.id}</div>
      <div><strong>Voucher Date:</strong> 01 October 2023 &nbsp; 13:19:32</div>
    </div>

    <div class="row">
      <div><strong>Name:</strong> Bhagwati Bhawan</div>
      <div><strong>Purpose:</strong> ${data.expenseName}</div>
    </div>

    <!-- Table -->
    <table>
      <thead>
        <tr>
          <th>Voucher Narration</th>
          <th class="amount">Amount</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            ${data.expenseDescription}
          </td>
          <td class="amount">₹ ${Number(data.expenseAmount ?? '0')?.toLocaleString('en-IN')}</td>
          <td>DR</td>
        </tr>
      </tbody>
    </table>

    <!-- Footer -->
    <div class="footer">
      <div class="signature">
        <div class="signature-line">Prepared By</div>
      </div>

      <div class="signature">
        <div class="signature-line">Signature</div>
      </div>
    </div>
  </div>

</body>
</html>
`;
};
