const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getDayName = (date: Date | string) => {
  if (!date) return '';

  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    timeZone: 'Asia/Kolkata',
  });
};
function numberToWords(num) {
  if (num === 0) return 'zero only';

  const ones = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];

  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  const scales = [
    { value: 10000000, label: 'crore' },
    { value: 100000, label: 'lakh' },
    { value: 1000, label: 'thousand' },
    { value: 100, label: 'hundred' },
  ];

  let words = '';

  for (const scale of scales) {
    if (num >= scale.value) {
      const count = Math.floor(num / scale.value);
      words +=
        numberToWords(count).replace(' only', '') + ' ' + scale.label + ' ';
      num %= scale.value;
    }
  }

  if (num > 0) {
    if (num < 20) {
      words += ones[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10) words += ' ' + ones[num % 10];
    }
  }

  return words.trim() + ' only';
}

export const DonationReceiptTemplate = (data) => {
  return `
  <!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />

    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
      body {
        font-family: Arial, sans-serif;
      }
      .bordered {
        border: 1px solid #000;
      }
    </style>
  </head>

  <body class="text-[14px]">
    <div class="bordered px-4">
      <!-- Header -->
      <div class="text-center mb-1">
        <div class="text-sm">|| Shree Ganeshay Namah ||</div>
        <div class="text-xl font-bold">SHREE SANTOSH CHARITABLE TRUST</div>
        <div class="text-xs">
          80G Regd. No. E-26036 (MUMBAI) Date: 07/09/2009 · PAN No.: AAITS6540D · Reg: AAITS6540D24MB01
        </div>

        <div class="text-xs mt-1 leading-tight">
          Head Office: 205, Vastu Prestige, 2nd Floor, New Link Road, Abv.
          Tanishq Showroom, Andheri (W), Mumbai - 53,<br />
          Tel.: +91-22-2634 7742 / 2634 7449<br />
          Site Add.: Village - Mahasar, Near Ateli Mandi, Tehsil - Narnaul,
          Dist. Mahendragrard, Haryana - 123021,<br />
          Office Phone - 01282-27722, 98139 27465
        </div>

        <div class="text-xs mt-1 italic">
          Mata se judne ke liye 022-61816315 par Misscall kare. Ye seva nishulk
          hai.
        </div>
      </div>

      <hr class="border border-black my-2" />

      <!-- Serial + Date -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Serial No.:</td>
          <td class="border-bb border-black w-[40%]">DA0009597</td>
          <td class="font-semibold w-[10%] pl-4">Date</td>
          <td class="border-bb border-black text-right">
            ${formatDate(data.donationDate)}
          </td>
        </tr>
      </table>

      <!-- Name -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Name:</td>
          <td class="border-bb border-black">
            ${data.donorFirstName} ${data.donorLastName}
          </td>
        </tr>
      </table>

      <!-- Address -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Address:</td>
          <td class="border-bb border-black">
            ${data?.customAddress ? data?.customAddress : [data.donorStreetAddress, data.city?.name, data.state?.name].filter(Boolean).join(', ')}
          </td>
        </tr>
      </table>

      <!-- Mobile + ID Proof -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Mobile No.:</td>
          <td class="border-bb border-black w-[30%]">
            ${data.donorPhoneNumber}
          </td>
          <td class="font-semibold w-[20%] pl-2">ID Proof Details:</td>
          <td class="border-bb border-black w-[15%]">
            ${data.donorIdProofType}
          </td>
          <td class="border-bb border-black w-[20%] pl-2">
            ${data.donorIdProofNumber}
          </td>
        </tr>
      </table>

      <!-- Amount in Words -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Amount in Words:</td>
          <td class="border-bb border-black">${numberToWords(data?.amount)}</td>
        </tr>
      </table>

      <!-- Payment Method -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">By Cash / Cheque:</td>
          <td class="border-bb border-black w-[20%]">${data.method}</td>

          <td class="font-semibold w-[15%] pl-2">Cheque No.:</td>
          <td class="border-bb border-black w-[20%]">
            ${data.chequeOrUpiReferenceNumber ?? ''}
          </td>
        </tr>
      </table>

      <!-- Receipt Type -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Receipt Type:</td>
          <td class="border-bb border-black w-[30%]">Donation Account</td>

          <td class="font-semibold w-[15%] pl-2">Bank Name:</td>
          <td class="border-bb border-black w-[30%]">${data.bankName ?? ''}</td>
        </tr>
      </table>

      <!-- Towards -->
      <table class="w-full mb-4">
        <tr>
          <td class="font-semibold w-[100%]">Towards Sahayog Rashi</td>
        </tr>
      </table>

      <!-- Amount Box -->
      <div class="flex items-center">
        <div class="flex items-center">
          <span class="font-semibold text-lg">Rs.</span>
          <div class="ml-2 border border-black px-1 py-1 font-bold text-xl">
            ${Number(data.amount ?? 0)?.toLocaleString('en-IN')}
          </div>
        </div>
        <div class="text-right ml-auto">
          FOR SHREE SANTOSH CHARITABLE TRUST<br />
          <div class="mt-4">Trustee / Authorised Signatory</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between text-sm">
        <div>
          ${getDayName(data.donationDate)}, ${formatDate(data.donationDate)}
        </div>
      </div>
    <div class="mt-1 mb-1 border-t" style="border-top: 1px dotted black w-[40%]"></div>

    </div>

    <div class="flex">
    <div class="mt-1 mb-1 border-t" style="border-top: 1px dotted black w-[40%]"></div>
    <div> Cut here </div>
    <div class="mt-1 mb-1 border-t" style="border-top: 1px dotted black w-[40%"></div>
    </div>

    <div class="bordered px-4">
      <!-- Header -->
      <div class="text-center mb-1">
        <div class="text-sm">|| Shree Ganeshay Namah ||</div>
        <div class="text-xl font-bold">SHREE SANTOSH CHARITABLE TRUST</div>
        <div class="text-xs">
          80G Regd. No. E-26036 (MUMBAI) Date: 07/09/2009 · PAN No.: AAITS6540D
        </div>

        <div class="text-xs mt-1 leading-tight">
          Head Office: 205, Vastu Prestige, 2nd Floor, New Link Road, Abv.
          Tanishq Showroom, Andheri (W), Mumbai - 53,<br />
          Tel.: +91-22-2634 7742 / 2634 7449<br />
          Site Add.: Village - Mahasar, Near Ateli Mandi, Tehsil - Narnaul,
          Dist. Mahendragrard, Haryana - 123021,<br />
          Office Phone - 01282-27722, 98139 27465
        </div>

        <div class="text-xs mt-1 italic">
          Mata se judne ke liye 022-61816315 par Misscall kare. Ye seva nishulk
          hai.
        </div>
      </div>

      <hr class="border border-black my-2" />

      <!-- Serial + Date -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Serial No.:</td>
          <td class="border-bb border-black w-[40%]">DA0009597</td>
          <td class="font-semibold w-[10%] pl-4">Date</td>
          <td class="border-bb border-black text-right">
            ${formatDate(data.donationDate)}
          </td>
        </tr>
      </table>

      <!-- Name -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Name:</td>
          <td class="border-bb border-black">
            ${data.donorFirstName} ${data.donorLastName}
          </td>
        </tr>
      </table>

      <!-- Address -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Address:</td>
          <td class="border-bb border-black">
            ${data?.customAddress ? data?.customAddress : [data.donorStreetAddress, data.city?.name, data.state?.name].filter(Boolean).join(', ')}
          </td>
        </tr>
      </table>

      <!-- Mobile + ID Proof -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Mobile No.:</td>
          <td class="border-bb border-black w-[30%]">
            ${data.donorPhoneNumber}
          </td>
          <td class="font-semibold w-[20%] pl-2">ID Proof Details:</td>
          <td class="border-bb border-black w-[15%]">
            ${data.donorIdProofType}
          </td>
          <td class="border-bb border-black w-[20%] pl-2">
            ${data.donorIdProofNumber}
          </td>
        </tr>
      </table>

      <!-- Amount in Words -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Amount in Words:</td>
          <td class="border-bb border-black">${numberToWords(data?.amount)}</td>
        </tr>
      </table>

      <!-- Payment Method -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">By Cash / Cheque:</td>
          <td class="border-bb border-black w-[20%]">${data.method}</td>

          <td class="font-semibold w-[15%] pl-2">Cheque No.:</td>
          <td class="border-bb border-black w-[20%]">
            ${data.chequeOrUpiReferenceNumber ?? ''}
          </td>
        </tr>
      </table>

      <!-- Receipt Type -->
      <table class="w-full mb-1">
        <tr>
          <td class="font-semibold w-[25%]">Receipt Type:</td>
          <td class="border-bb border-black w-[30%]">Donation Account</td>

          <td class="font-semibold w-[15%] pl-2">Bank Name:</td>
          <td class="border-bb border-black w-[30%]">${data.bankName ?? ''}</td>
        </tr>
      </table>

      <!-- Towards -->
      <table class="w-full mb-4">
        <tr>
          <td class="font-semibold w-[100%]">Towards Sahayog Rashi</td>
        </tr>
      </table>

      <!-- Amount Box -->
      <div class="flex items-center">
        <div class="flex items-center">
          <span class="font-semibold text-lg">Rs.</span>
          <div class="ml-2 border border-black px-1 py-1 font-bold text-xl">
            ${Number(data.amount ?? 0)?.toLocaleString('en-IN')}
          </div>
        </div>
        <div class="text-right ml-auto">
          FOR SHREE SANTOSH CHARITABLE TRUST<br />
          <div class="mt-4">Trustee / Authorised Signatory</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between text-sm">
        <div>
          ${getDayName(data.donationDate)}, ${formatDate(data.donationDate)}
        </div>
      </div>
    <div class="mt-1 mb-1 border-t" style="border-top: 1px dotted black w-[40%]"></div>

    </div>
  </body>
</html>

    `;
};
