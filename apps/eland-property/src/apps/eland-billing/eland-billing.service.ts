import { Injectable } from '@nestjs/common';
import { CreateElandBillingDto } from './dto/create-eland-billing.dto';
import { UpdateElandBillingDto } from './dto/update-eland-billing.dto';

@Injectable()
export class ElandBillingService {
  create(createElandBillingDto: CreateElandBillingDto) {
    return 'This action adds a new elandBilling';
  }

  findAll() {
    return `This action returns all elandBilling`;
  }

  findOne(id: number) {
    return `This action returns a #${id} elandBilling`;
  }

  update(id: number, updateElandBillingDto: UpdateElandBillingDto) {
    return `This action updates a #${id} elandBilling`;
  }

  remove(id: number) {
    return `This action removes a #${id} elandBilling`;
  }
}
