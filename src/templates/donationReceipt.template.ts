export const DonationReceiptTemplate = () => {
  return `
    <!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<!-- Tailwind CDN -->
<script src="https://cdn.tailwindcss.com"></script>

<style>
  @page {
    margin: 15mm;
  }
  body {
    font-family: Arial, sans-serif;
  }
  .bordered {
    border: 1px solid #000;
  }
</style>
</head>

<body class="text-[14px]">

<div class="bordered p-4">

  <!-- Header -->
  <div class="text-center mb-2">
    <div class="text-sm">|| Shree Ganeshay Namah ||</div>
    <div class="text-xl font-bold">SHREE SANTOSH CHARITABLE TRUST</div>
    <div class="text-xs">
      80G Regd. No. E-26036 (MUMBAI) Date: 07/09/2009 · PAN No.: AAITS6540D
    </div>

    <div class="text-xs mt-1 leading-tight">
      Head Office: 205, Vastu Prestige, 2nd Floor, New Link Road, Abv. Tanishq Showroom, Andheri (W), Mumbai - 53,<br/>
      Tel.: +91-22-2634 7742 / 2634 7449<br/>
      Site Add.: Village - Mahasar, Near Ateli Mandi, Tehsil - Narnaul, Dist. Mahendragrard, Haryana - 123021,<br/>
      Office Phone - 01282-27722, 98139 27465
    </div>

    <div class="text-xs mt-1 italic">
      Mata se judne ke liye 022-61816315 par Misscall kare. Ye seva nishulk hai.
    </div>
  </div>

  <hr class="border border-black my-2"/>

  <!-- Serial + Date -->
  <table class="w-full mb-3">
    <tr>
      <td class="font-semibold w-[25%]">Serial No.:</td>
      <td class="border-b border-black w-[40%]">DA0009597</td>
      <td class="font-semibold w-[10%] pl-4">Date</td>
      <td class="border-b border-black w-[10%] text-center">5</td>
      <td class="border-b border-black w-[15%] text-center">October</td>
    </tr>
  </table>

  <!-- Name -->
  <table class="w-full mb-2">
    <tr>
      <td class="font-semibold w-[25%]">Name:</td>
      <td class="border-b border-black">Abhinav Agarwal</td>
    </tr>
  </table>

  <!-- Address -->
  <table class="w-full mb-2">
    <tr>
      <td class="font-semibold w-[25%]">Address:</td>
      <td class="border-b border-black">Blank</td>
    </tr>
  </table>

  <!-- Mobile + ID Proof -->
  <table class="w-full mb-2">
    <tr>
      <td class="font-semibold w-[25%]">Mobile No.:</td>
      <td class="border-b border-black w-[30%]">9415416205</td>
      <td class="font-semibold w-[20%] pl-2">ID Proof Details:</td>
      <td class="border-b border-black w-[15%]">Aadhaar Card</td>
      <td class="border-b border-black w-[20%] pl-2">755693758069</td>
    </tr>
  </table>

  <!-- Amount in Words -->
  <table class="w-full mb-2">
    <tr>
      <td class="font-semibold w-[25%]">Amount in Words:</td>
      <td class="border-b border-black">Two Thousands Rupees Only</td>
    </tr>
  </table>

  <!-- Payment Method -->
  <table class="w-full mb-2">
    <tr>
      <td class="font-semibold w-[25%]">By Cash / Cheque:</td>
      <td class="border-b border-black w-[20%]">Cash</td>

      <td class="font-semibold w-[15%] pl-2">Cheque No.:</td>
      <td class="border-b border-black w-[20%]"></td>
    </tr>
  </table>

  <!-- Receipt Type -->
  <table class="w-full mb-2">
    <tr>
      <td class="font-semibold w-[25%]">Receipt Type:</td>
      <td class="border-b border-black w-[30%]">Donation Account</td>

      <td class="font-semibold w-[15%] pl-2">Bank Name:</td>
      <td class="border-b border-black w-[30%]">Select One</td>
    </tr>
  </table>

  <!-- Towards -->
  <table class="w-full mb-4">
    <tr>
      <td class="font-semibold w-[25%]">Towards Sahayog Rashi:</td>
      <td class="border-b border-black"></td>
    </tr>
  </table>

  <!-- Amount Box -->
  <div class="flex items-center mb-6">
    <span class="font-semibold text-lg">Rs.</span>
    <div class="ml-2 border border-black px-6 py-2 font-bold text-xl">
      2,000.00
    </div>
  </div>

  <!-- Footer -->
  <div class="flex justify-between text-sm mt-4 pt-2 border-t border-black">
    <div>
      Sunday, 5 October, 2025 &nbsp;&nbsp; 7:49:59 am
    </div>
    <div class="text-right">
      FOR SHREE SANTOSH CHARITABLE TRUST<br/>
      <div class="mt-4">Trustee / Authorised Signatory</div>
    </div>
  </div>

</div>

</body>
</html>

    `;
};
