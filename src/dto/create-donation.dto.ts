export class CreateDonationDto {
  donorId: number;
  method: string;
  referenceNo?: string;
  amount: number;
  date?: string;
  bankName?: string;
}


