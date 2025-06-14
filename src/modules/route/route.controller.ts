import { Controller, HttpStatus } from '@nestjs/common';
import { RouteService } from './route.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DTO_RQ_CreateRoute } from './route.dto';

@Controller()
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @MessagePattern({ bms: 'create_route' })
  async createRoute(@Payload() data: DTO_RQ_CreateRoute) {
    try {
      const result = await this.routeService.createRoute(data);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Tạo tuyến thành công',
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

  @MessagePattern({ bms: 'get_list_route_by_company' })
  async getListRouteByCompany(@Payload() id: number) {
    try {
      const result = await this.routeService.getListRouteByCompany(id);
      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Lấy danh sách tuyến thành công',
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
}
