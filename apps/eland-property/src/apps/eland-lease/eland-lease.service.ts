import { Injectable } from '@nestjs/common';
import { CreateElandLeaseDto } from './dto/create-eland-lease.dto';
import { UpdateElandLeaseDto } from './dto/update-eland-lease.dto';

@Injectable()
export class ElandLeaseService {
  create(createElandLeaseDto: CreateElandLeaseDto) {
    return 'This action adds a new elandLease';
  }

  findAll() {
    return `This action returns all elandLease`;
  }

  findOne(id: number) {
    return `This action returns a #${id} elandLease`;
  }

  update(id: number, updateElandLeaseDto: UpdateElandLeaseDto) {
    return `This action updates a #${id} elandLease`;
  }

  remove(id: number) {
    return `This action removes a #${id} elandLease`;
  }
}
