import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { OfficeService } from './office.service';
import { DTO_RQ_CreateOffice, DTO_RQ_UpdateOffice } from './office.dto';

@Controller()
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}
  @MessagePattern({ bms: 'get_office_info' })
  getOffice() {
    return {
      success: true,
      statusCode: 200,
      message: 'Office service is running',
    };
  }

  @MessagePattern({ bms: 'create_office' })
  async createOffice(@Payload() data: DTO_RQ_CreateOffice) {
    try {
      const result = await this.officeService.createOffice(data);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Tạo văn phòng thành công',
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

  @MessagePattern({ bms: 'delete_office' })
  async deleteOffice(@Payload() id: number) {
    try {
      await this.officeService.deleteOffice(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Xóa văn phòng thành công',
      };
    } catch (error) {
      throw new RpcException({
        success: false,
        message: error.response?.message || 'Lỗi máy chủ dịch vụ!',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ bms: 'update_office' })
  async updateOffice(
    @Payload() payload: { id: number; data: DTO_RQ_UpdateOffice },
  ) {
    try {
      const result = await this.officeService.updateOffice(
        payload.id,
        payload.data,
      );
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Cập nhật văn phòng thành công',
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

  @MessagePattern({ bms: 'get_list_office_by_company' })
  async getListOfficeByCompany(@Payload() id: number) {
    try {
      const result = await this.officeService.getListOfficeByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách văn phòng thành công',
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

  @MessagePattern({ bms: 'get_list_office_name_by_company' })
  async getListOfficeNameByCompany(@Payload() id: number) {
    try {
      const result = await this.officeService.getListOfficeNameByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách tên văn phòng thành công',
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
}
