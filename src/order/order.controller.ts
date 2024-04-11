import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { PaymentOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { PaymentStatusDto } from './payment-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('by-user')
  @Auth()
  getByUserId(@CurrentUser('id') userId: number) {
    return this.orderService.getByUserId(userId);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @Auth()
  @HttpCode(200)
  placeOrder(@CurrentUser('id') userId: number, @Body() dto: PaymentOrderDto) {
    return this.orderService.placeOrder(dto, userId);
  }   

  @UsePipes(new ValidationPipe())
  @Post('status')
  @HttpCode(200)
  @Auth()
  updateStatus(@Body() dto: PaymentStatusDto) {
    return this.orderService.updateStatus(dto);
  }   

  @Get()   
  @Auth('admin')   
  getAll() {
    return this.orderService.getAll()
  }

}
