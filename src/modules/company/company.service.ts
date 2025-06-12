import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import {
  DTO_RP_Company,
  DTO_RQ_CreateCompany,
  DTO_RQ_UpdateCompany,
} from './company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async createCompany(data: DTO_RQ_CreateCompany): Promise<DTO_RP_Company> {
    console.log('Received data for createCompany:', data);
    const existingCompanyByName = await this.companyRepository.findOne({
      where: { name: data.name },
    });

    if (existingCompanyByName) {
      throw new ConflictException('Tên công ty đã tồn tại');
    }

    const existingCompanyByCode = await this.companyRepository.findOne({
      where: { code: data.code },
    });

    if (existingCompanyByCode) {
      throw new ConflictException('Mã công ty đã tồn tại');
    }
    const newCompany = this.companyRepository.create(data);
    const savedCompany = await this.companyRepository.save(newCompany);
    const result: DTO_RP_Company = {
      id: savedCompany.id,
      name: savedCompany.name,
      phone: savedCompany.phone,
      address: savedCompany.address,
      tax_code: savedCompany.tax_code,
      status: savedCompany.status,
      url_image: savedCompany.url_image,
      code: savedCompany.code,
      note: savedCompany.note,
      created_at: savedCompany.created_at,
    };
    return result;
  }

  async updateCompany(
    id: number,
    data: DTO_RQ_UpdateCompany,
  ): Promise<DTO_RP_Company> {
    const existingCompany = await this.companyRepository.findOne({
      where: { id },
    });

    if (!existingCompany) {
      throw new NotFoundException('Công ty không tồn tại');
    }

    if (data.name) {
      const companyWithSameName = await this.companyRepository.findOne({
        where: { name: data.name },
      });
      if (companyWithSameName && companyWithSameName.id !== id) {
        throw new ConflictException('Tên công ty đã tồn tại');
      }
    }

    if (data.code) {
      const companyWithSameCode = await this.companyRepository.findOne({
        where: { code: data.code },
      });
      if (companyWithSameCode && companyWithSameCode.id !== id) {
        throw new ConflictException('Mã công ty đã tồn tại');
      }
    }

    Object.assign(existingCompany, data);
    const updatedCompany = await this.companyRepository.save(existingCompany);

    const result: DTO_RP_Company = {
      id: updatedCompany.id,
      name: updatedCompany.name,
      phone: updatedCompany.phone,
      address: updatedCompany.address,
      tax_code: updatedCompany.tax_code,
      status: updatedCompany.status,
      url_image: updatedCompany.url_image,
      code: updatedCompany.code,
      note: updatedCompany.note,
      created_at: updatedCompany.created_at,
    };

    return result;
  }

  async deleteCompany(id: number): Promise<void> {
    const existingCompany = await this.companyRepository.findOne({
      where: { id },
    });
    if (!existingCompany) {
      throw new NotFoundException('Công ty không tồn tại');
    }
    await this.companyRepository.delete(id);
  }
}
