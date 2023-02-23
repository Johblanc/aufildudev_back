import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConflictException, NotFoundException } from '@nestjs/common/exceptions';
import { ApiTags } from '@nestjs/swagger';
import { CreateFrameworkDto } from './dto/create-framework.dto';
import { UpdateFrameworkDto } from './dto/update-framework.dto';
import { FrameworksService } from './frameworks.service';




@ApiTags('frameworks')
@Controller('frameworks')
export class FrameworksController {
  constructor(private readonly frameworkService: FrameworksService) { }

  @Post()
  async create(@Body() createFrameworkDto: CreateFrameworkDto) {
    const verificationName = await this.frameworkService.findOneFrameworkName(createFrameworkDto.name)

    if (verificationName) {
      throw new ConflictException('Framework déja existant')
    };

    const newFramework = await this.frameworkService.createFramework(
      createFrameworkDto
    );
    return {
      message: 'nouveau Framework ajouté',
      data: newFramework
    }
  }


  @Get()
  async findAll() {
    const data = await this.frameworkService.findAllFrameworks();

    if (data.length != 0) {
      return {
        message: 'liste des Frameworks disponible',
        data: data
      }
    }
   
  }



  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.frameworkService.findOneFramework(+id)

    if (!data) {
      throw new NotFoundException("l'ID ne correspond à aucun Framework")
    };
    return {
      message: "Framework:",
      data: data
    }
  }



  @Patch(':id')
  async updateFramework(
    @Param('id') id: number,
    @Body() updateFrameworkDto: UpdateFrameworkDto
  ) {
    const data = await this.frameworkService.findOneFramework(+id);

    if (!data) {
      throw new NotFoundException("l'ID' ne correspond à aucun Framework")
    }
    const result = await this.frameworkService.updateFramework(data.id, updateFrameworkDto);
    return {
      message: "Framework modifié",
      data: result
    }
  }


  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.frameworkService.findOneFramework(+id)

    if (!data) {
      throw new NotFoundException("l'ID' ne correspond à aucun Framework")
    }
    const remove = await this.frameworkService.removeFramework(id)

    return {
      message: "Le language à bien été supprimé",
      data: remove
    }
  }

}