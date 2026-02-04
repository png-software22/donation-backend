import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VoidDonationDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
