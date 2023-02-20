import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common/exceptions';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ApiTags } from '@nestjs/swagger';
import { Language } from './entities/language.entity';
import { In } from 'typeorm';



@ApiTags('languages')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) { }

  @Post()
  async create(@Body() createLanguageDto: CreateLanguageDto) {
    const verificationName = await this.languagesService.findOneLanguageName(createLanguageDto.name)

    if (verificationName) {
      throw new ConflictException('Language déja existant')
    };

    const newLanguage = await this.languagesService.createLanguage(
      createLanguageDto
    );
    return {
      message: 'nouveau language ajouté',
      data: newLanguage
    }
  }


  @Get()
  async findAll() {
    const data = await this.languagesService.findAllLanguages();

    if (data.length != 0) {
      return {
        message: 'liste des languages disponible',
        data: data
      }
    }
    throw new NotFoundException('aucun language disponible')
  }



  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.languagesService.findOneLanguage(+id)

    if (!data) {
      throw new NotFoundException("l'ID ne correspond à aucun language")
    };
    return {
      message: "language:",
      data: data
    }
  }



  @Patch(':id')
  async updateLanguage(
    @Param('id') id: number,
    @Body() updateLanguageDto: UpdateLanguageDto
  ) {
    const data = await this.languagesService.findOneLanguage(+id);

    if (!data) {
      throw new NotFoundException("l'ID' ne correspond à aucun Language")
    }
    const result = await this.languagesService.updateLanguage(data.id, updateLanguageDto);
    return {
      message: "Language modifié",
      data: result
    }
  }


  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.languagesService.findOneLanguage(+id)

    if (!data) {
      throw new NotFoundException("l'ID' ne correspond à aucun Language")
    }
    const remove = await this.languagesService.removeLanguage(id)

    return {
      message: "Le language à bien été supprimé",
      data:remove
    }
  }

}