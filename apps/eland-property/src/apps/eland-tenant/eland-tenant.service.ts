import { Injectable } from '@nestjs/common';
import { CreateElandTenantDto } from './dto/create-eland-tenant.dto';
import { UpdateElandTenantDto } from './dto/update-eland-tenant.dto';

@Injectable()
export class ElandTenantService {
  create(createElandTenantDto: CreateElandTenantDto) {
    return 'This action adds a new elandTenant';
  }

  findAll() {
    return `This action returns all elandTenant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} elandTenant`;
  }

  update(id: number, updateElandTenantDto: UpdateElandTenantDto) {
    return `This action updates a #${id} elandTenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} elandTenant`;
  }
}
