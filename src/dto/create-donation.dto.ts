export class CreateDonationDto {
  donorId: number;
  method: string;
  referenceNo?: string;
  amount: number;
  date?: Date;
  bankName?: string;
}
