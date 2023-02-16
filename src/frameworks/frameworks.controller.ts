import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FrameworksService } from './frameworks.service';
import { CreateFrameworkDto } from './dto/create-framework.dto';
import { UpdateFrameworkDto } from './dto/update-framework.dto';

@Controller('frameworks')
export class FrameworksController {
  constructor(private readonly frameworksService: FrameworksService) {}

  @Post()
  create(@Body() createFrameworkDto: CreateFrameworkDto) {
    return this.frameworksService.create(createFrameworkDto);
  }

  @Get()
  findAll() {
    return this.frameworksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.frameworksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFrameworkDto: UpdateFrameworkDto) {
    return this.frameworksService.update(+id, updateFrameworkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.frameworksService.remove(+id);
  }
}
