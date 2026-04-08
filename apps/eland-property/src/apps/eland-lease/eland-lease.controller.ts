import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ElandLeaseService } from './eland-lease.service';
import { CreateElandLeaseDto } from './dto/create-eland-lease.dto';
import { UpdateElandLeaseDto } from './dto/update-eland-lease.dto';

@Controller('eland-lease')
export class ElandLeaseController {
  constructor(private readonly elandLeaseService: ElandLeaseService) {}

  @Post()
  create(@Body() createElandLeaseDto: CreateElandLeaseDto) {
    return this.elandLeaseService.create(createElandLeaseDto);
  }

  @Get()
  findAll() {
    return this.elandLeaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.elandLeaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateElandLeaseDto: UpdateElandLeaseDto) {
    return this.elandLeaseService.update(+id, updateElandLeaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.elandLeaseService.remove(+id);
  }
}
