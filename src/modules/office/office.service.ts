import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DTO_RP_Office,
  DTO_RP_Office_2,
  DTO_RQ_CreateOffice,
  DTO_RQ_UpdateOffice,
} from './office.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../company/company.entity';
import { Repository } from 'typeorm';
import { Office } from './office.entity';
import { OfficePhone } from './office_phone.entity';

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,

    @InjectRepository(OfficePhone)
    private readonly officePhoneRepository: Repository<OfficePhone>,
  ) {}

  async createOffice(data: DTO_RQ_CreateOffice): Promise<DTO_RP_Office> {
    console.log('Received data for createOffice:', data);
    const company = await this.companyRepository.findOne({
      where: { id: data.company_id },
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    const existingOffice = await this.officeRepository.findOne({
      where: {
        name: data.name,
        company: { id: data.company_id },
      },
      relations: ['company'],
    });

    if (existingOffice) {
      throw new ConflictException('Tên văn phòng đã tồn tại.');
    }

    const office = this.officeRepository.create({
      name: data.name,
      code: data.code,
      address: data.address,
      note: data.note,
      status: data.status,
      company: company,
    });

    if (data.phones?.length > 0) {
      office.phones = data.phones.map((phone) =>
        this.officePhoneRepository.create({
          phone: phone.phone,
          type: phone.type,
        }),
      );
    }
    const savedOffice = await this.officeRepository.save(office);
    if (savedOffice.phones) {
      savedOffice.phones.forEach((p) => delete p.office);
    }

    return {
      id: savedOffice.id,
      name: savedOffice.name,
      code: savedOffice.code,
      address: savedOffice.address,
      note: savedOffice.note,
      status: savedOffice.status,
      created_at: savedOffice.created_at,
      phones: (savedOffice.phones || []).map((phone) => ({
        id: phone.id,
        phone: phone.phone,
        type: phone.type,
      })),
    };
  }

  async deleteOffice(id: number): Promise<void> {
    const office = await this.officeRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!office) {
      throw new NotFoundException('Văn phòng không tồn tại');
    }

    await this.officeRepository.remove(office);
  }

  async updateOffice(
    id: number,
    data: DTO_RQ_UpdateOffice,
  ): Promise<DTO_RP_Office> {
    const office = await this.officeRepository.findOne({
      where: { id },
      relations: ['company', 'phones'],
    });

    if (!office) {
      throw new NotFoundException('Văn phòng không tồn tại');
    }

    if (data.name) {
      const existingOffice = await this.officeRepository.findOne({
        where: {
          name: data.name,
          company: { id: office.company.id },
        },
      });

      if (existingOffice && existingOffice.id !== id) {
        throw new ConflictException('Tên văn phòng đã tồn tại.');
      }
    }

    office.name = data.name;
    office.code = data.code;
    office.address = data.address;
    office.note = data.note;
    office.status = data.status;

    if (data.phones) {
      const inputPhones = data.phones;

      const inputPhoneIds = inputPhones.filter((p) => p.id).map((p) => p.id);

      office.phones = office.phones.filter((existingPhone) => {
        if (!inputPhoneIds.includes(existingPhone.id)) {
          this.officePhoneRepository.delete(existingPhone.id);
          return false;
        }
        return true;
      });

      for (const phone of inputPhones) {
        if (phone.id) {
          const existing = office.phones.find((p) => p.id === phone.id);
          if (existing) {
            existing.phone = phone.phone;
            existing.type = phone.type;
          }
        } else {
          const newPhone = this.officePhoneRepository.create({
            phone: phone.phone,
            type: phone.type,
            office: office,
          });
          office.phones.push(newPhone);
        }
      }
    }

    const updatedOffice = await this.officeRepository.save(office);

    if (updatedOffice.phones) {
      updatedOffice.phones.forEach((p) => delete p.office);
    }

    return {
      id: updatedOffice.id,
      name: updatedOffice.name,
      code: updatedOffice.code,
      address: updatedOffice.address,
      note: updatedOffice.note,
      status: updatedOffice.status,
      created_at: updatedOffice.created_at,
      phones: updatedOffice.phones.map((p) => ({
        id: p.id,
        phone: p.phone,
        type: p.type,
      })),
    };
  }

  async getListOfficeByCompany(id: number): Promise<DTO_RP_Office[]> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['offices', 'offices.phones'],
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    return company.offices.map((office) => ({
      id: office.id,
      name: office.name,
      code: office.code,
      address: office.address,
      note: office.note,
      status: office.status,
      created_at: office.created_at,
      phones: (office.phones || []).map((phone) => ({
        id: phone.id,
        phone: phone.phone,
        type: phone.type,
      })),
    }));
  }

  async getListOfficeNameByCompany(
    id: number,
  ): Promise<{ id: number; name: string }[]> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['offices'],
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    return company.offices.map((office) => ({
      id: office.id,
      name: office.name,
    }));
  }

  async getListOfficeByCompany_2(id: number): Promise<DTO_RP_Office_2[]> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['offices', 'offices.phones'],
    });

    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    return company.offices.map((office) => ({
      id: office.id,
      name: office.name,
      code: office.code,
      address: office.address,
      note: office.note,
      status: office.status,
      phones: (office.phones || []).map((phone) => ({
        id: phone.id,
        phone: phone.phone,
        type: phone.type,
      })),
      company_id: company.id,
      company_name: company.name,
      company_code: company.code,
    }));
  }
}
