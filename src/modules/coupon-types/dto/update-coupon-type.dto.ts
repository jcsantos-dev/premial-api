import { PartialType } from '@nestjs/swagger';
import { CreateCouponTypeDto } from './create-coupon-type.dto';

export class UpdateCouponTypeDto extends PartialType(CreateCouponTypeDto) {}
