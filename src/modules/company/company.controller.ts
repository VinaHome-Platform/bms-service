import { Controller, HttpStatus } from '@nestjs/common';
import { CompanyService } from './company.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_CreateCompany, DTO_RQ_UpdateCompany } from './company.dto';

@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @MessagePattern({ bms: 'create_company' })
  async createCompany(@Payload() data: DTO_RQ_CreateCompany) {
    try {
      const result = await this.companyService.createCompany(data);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Tạo công ty thành công',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Lỗi máy chủ dịch vụ!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'update_company' })
  async updateCompany(
    @Payload() payload: { id: number; data: DTO_RQ_UpdateCompany },
  ) {
    try {
      const result = await this.companyService.updateCompany(
        payload.id,
        payload.data,
      );
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Cập nhật công ty thành công',
        result,
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message:
          error.response?.message || error.message || 'Lỗi máy chủ dịch vụ!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'delete_company' })
  async deleteCompany(@Payload() id: number) {
    try {
      await this.companyService.deleteCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Xóa công ty thành công',
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message:
          error.response?.message || error.message || 'Lỗi máy chủ dịch vụ!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
