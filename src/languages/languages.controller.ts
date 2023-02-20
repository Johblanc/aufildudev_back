import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BadRequestException, ConflictException } from '@nestjs/common/exceptions';
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
      throw new ConflictException('Language deja existant')
    };

    const newLanguage = await this.languagesService.createLanguage(
      createLanguageDto
    );
    return {
      message: 'nouveau language ajoute',
      data: newLanguage
    }
  }




  /* @Get()
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.languagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    //verifier que le NOUVEAU name nexiste pas deja
    return this.languagesService.update(+id, updateLanguageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.languagesService.remove(+id);
  } */
}
