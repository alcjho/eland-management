import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ElandBillingService } from './eland-billing.service';
import { CreateElandBillingDto } from './dto/create-eland-billing.dto';
import { UpdateElandBillingDto } from './dto/update-eland-billing.dto';

@Controller('eland-billing')
export class ElandBillingController {
  constructor(private readonly elandBillingService: ElandBillingService) {}

  @Post()
  create(@Body() createElandBillingDto: CreateElandBillingDto) {
    return this.elandBillingService.create(createElandBillingDto);
  }

  @Get()
  findAll() {
    return this.elandBillingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.elandBillingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateElandBillingDto: UpdateElandBillingDto) {
    return this.elandBillingService.update(+id, updateElandBillingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.elandBillingService.remove(+id);
  }
}
