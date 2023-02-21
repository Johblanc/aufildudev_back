import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConflictException, NotFoundException } from '@nestjs/common/exceptions';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';




@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const verificationName = await this.categoriesService.findOneCategorieName(createCategoryDto.name)

    if (verificationName) {
      throw new ConflictException('Categorie déja existante')
    };

    const data = await this.categoriesService.createCategorie(
      createCategoryDto
    );
    return {
      message: 'nouvelle Categorie ajoutée',
      data: data
    }
  }


  @Get()
  async findAll() {
    const data = await this.categoriesService.findAllCategories();

    if (data.length != 0) {
      return {
        message: 'liste des Categories disponible',
        data: data
      }
    }
    throw new NotFoundException('aucune Categorie disponible')
  }



  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.categoriesService.findOneCategorie(+id)

    if (!data) {
      throw new NotFoundException("l'ID ne correspond à aucune Categorie")
    };
    return {
      message: "Categorie:",
      data: data
    }
  }



  @Patch(':id')
  async updateCategorie(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    const data = await this.categoriesService.findOneCategorie(+id);

    if (!data) {
      throw new NotFoundException("l'ID' ne correspond à aucune Catégorie")
    }
    const result = await this.categoriesService.updateCategorie(data.id, updateCategoryDto);
    return {
      message: "Catégorie modifiée",
      data: result
    }
  }


  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.categoriesService.findOneCategorie(+id)

    if (!data) {
      throw new NotFoundException("l'ID' ne correspond à aucune Catégorie")
    }
    const remove = await this.categoriesService.removeCategorie(id)

    return {
      message: "LaCatégorie à bien été supprimé",
      data: remove
    }
  }

}