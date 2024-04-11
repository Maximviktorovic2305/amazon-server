import { PartialType } from '@nestjs/mapped-types';
import { PaymentOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(PaymentOrderDto) {}
