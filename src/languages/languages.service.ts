import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language } from './entities/language.entity';

@Injectable()
export class LanguagesService {
  async createLanguage(createLanguageDto: CreateLanguageDto) {
    const newLanguage = Language.create({
      name: createLanguageDto.name
    });
    const language = await Language.save(newLanguage);
    return language
  };



  async findAllLanguages() {
    const languages = await Language.find();
    return languages
  }


  
  async findOneLanguage(languageId: number) {
    const language = await Language.findOneBy({ id: languageId });
    return language
  }


  async findOneLanguageName(name: string) {
    return await Language.findOneBy({ name: name });
  }


  async findManyLanguage(languageId: number[]) {
    const languages = await Language.findBy({
      id: In(languageId)
    })
    return languages
  }


  async updateLanguage(languageId: number, updateLanguageDto: UpdateLanguageDto): Promise<Language | null> {
    const language = await Language.findOneBy({ id: languageId });
    if (language !== null) {
      if (updateLanguageDto.name)
        language.name = updateLanguageDto.name;
      await language.save()
    }
    return language
  }


  async removeLanguage(languageId: number): Promise<Language | null> {
    const language = await Language.findOneBy({ id: languageId });
    if (language !== null) {
      await language.remove()

    }
    return language;
  }
}
