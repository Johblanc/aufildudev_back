import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';


@Injectable()
export class CategoriesService {
  async createCategorie(createCategoryDto: CreateCategoryDto) {
    const newCategorie = Category.create({
      name: createCategoryDto.name
    });
    const data = await Category.save(newCategorie);
    return data
  };



  async findAllCategories() {
    const data = await Category.find();
    return data
  }



  async findOneCategorie(categorieId: number) {
    const data = await Category.findOneBy({ id: categorieId });
    return data
  }


  async findOneCategorieName(name: string) {
    return await Category.findOneBy({ name: name });
  }


  async findManyCategories(categorieId: number[]) {
    const data = await Category.findBy({
      id: In(categorieId)
    })
    return data
  }


  async updateCategorie(categorieId: number, updateCategoryDto: UpdateCategoryDto): Promise<Category | null> {
    const data = await Category.findOneBy({ id: categorieId });
    if (data !== null) {
      if (updateCategoryDto.name)
        data.name = updateCategoryDto.name;
      await data.save()
    }
    return data
  }


  async removeCategorie(categorieId: number): Promise<Category| null> {
    const data = await Category.findOneBy({ id: categorieId });
    if (data !== null) {
      await data.remove()

    }
    return data;
  }
}
