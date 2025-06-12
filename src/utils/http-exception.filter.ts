import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { RpcException } from '@nestjs/microservices';

@Catch(HttpException, RpcException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | RpcException, host: ArgumentsHost) {
    // Chuyển đổi host sang ngữ cảnh microservice
    host.switchToRpc();

    let statusCode: number;
    let message: string;
    const success: boolean = false;

    // Xử lý RpcException
    if (exception instanceof RpcException) {
      const error = exception.getError();

      // Nếu error đã có cấu trúc đầy đủ
      if (
        typeof error === 'object' &&
        error !== null &&
        'statusCode' in error
      ) {
        return error;
      }

      // Nếu error là string
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message =
        typeof error === 'string' ? error : 'Lỗi dịch vụ không xác định';
    }
    // Xử lý HttpException
    else {
      statusCode = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        message = response['message'] || 'Lỗi dịch vụ';
        if (Array.isArray(message)) {
          message = message.join(', ');
        }
      }
    }

    // Trả về response thống nhất
    return {
      success,
      statusCode,
      message,
    };
  }
}
