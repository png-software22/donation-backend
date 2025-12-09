export class CreateDonorDTO {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  idProofType: string;
  idProofNumber: string;
  streetAddress: string;
  stateId: number;
  cityId: number;
  customAddress?:string;
}

export class UpdateDonorDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  altPhoneNumber?: string;
  street?: string;
  cityId?: number;
  stateId?: number;
  idProofType?: string;
  idProofNumber?: string;
}
