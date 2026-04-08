import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ElandTenantService } from './eland-tenant.service';
import { CreateElandTenantDto } from './dto/create-eland-tenant.dto';
import { UpdateElandTenantDto } from './dto/update-eland-tenant.dto';

@Controller('eland-tenant')
export class ElandTenantController {
  constructor(private readonly elandTenantService: ElandTenantService) {}

  @Post()
  create(@Body() createElandTenantDto: CreateElandTenantDto) {
    return this.elandTenantService.create(createElandTenantDto);
  }

  @Get()
  findAll() {
    return this.elandTenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.elandTenantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateElandTenantDto: UpdateElandTenantDto) {
    return this.elandTenantService.update(+id, updateElandTenantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.elandTenantService.remove(+id);
  }
}
