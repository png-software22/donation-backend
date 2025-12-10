import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Donation } from "../models/donation.model";
import { CreateDonationDto } from "../dto/create-donation.dto";
import { Donor } from "../models/donor.model";

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Donation) private donationModel: typeof Donation,
    @InjectModel(Donor) private donorModel: typeof Donor
  ) {}

  async createDonation(dto: CreateDonationDto) {
    const donor = await this.donorModel.findByPk(dto.donorId);

    if (!donor) {
      throw new Error("Donor not found");
    }

    // Auto generate donation serial number
    const serial = "DN-" + Date.now();

    const donation = await this.donationModel.create({
      donorId: dto.donorId,
      donationSerialNumber: serial,
      method: dto.method,
      chequeOrUpiReferenceNumber:
        dto.method === "CASH" ? null : dto.referenceNo,
      amount: dto.amount,
      donationDate: dto.date,
      bankName: dto.method === "CASH" ? null : dto.bankName,

      // Snapshot of donor info at time of donation
      donorFirstName: donor.firstName,
      donorLastName: donor.lastName,
      donorPhoneNumber: donor.phoneNumber,
      donorIdProofType: donor.idProofType,
      donorIdProofNumber: donor.idProofNumber,
      donorStreetAddress: donor.streetAddress,
      donorCustomAddress: donor.customAddress,
      donorStateId: donor.stateId,
      donorCityId: donor.cityId,
    });

    return {
      message: "Donation Saved Successfully",
      donation,
    };
  }
}
