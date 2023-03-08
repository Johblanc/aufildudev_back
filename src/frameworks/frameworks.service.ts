import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { CreateFrameworkDto } from './dto/create-framework.dto';
import { UpdateFrameworkDto } from './dto/update-framework.dto';
import { Framework } from './entities/framework.entity';



@Injectable()
export class FrameworksService {
  async createFramework(createFrameworkDto: CreateFrameworkDto) {
    const newFramework = Framework.create({
      name: createFrameworkDto.name
    });
    const data = await Framework.save(newFramework);
    return data
  };



  async findAllFrameworks() {
    const data = await Framework.find();
    return data
  }



  async findOneFramework(frameworkId: number) {
    const data = await Framework.findOneBy({ id: frameworkId });
    return data
  }


  async findOneFrameworkName(name: string) {
    return await Framework.findOneBy({ name: name });
  }


  async findManyFramework(frameworkId: number[]) {
    const data = await Framework.findBy({
      id: In(frameworkId)
    })
    return data
  }


  async updateFramework(frameworkId: number, updateFrameworkDto: UpdateFrameworkDto): Promise<Framework | null> {
    const data = await Framework.findOneBy({ id: frameworkId });
    if (data !== null) {
      if (updateFrameworkDto.name)
        data.name = updateFrameworkDto.name;
      await data.save()
    }
    return data
  }


  async removeFramework(frameworkId: number): Promise<Framework | null> {
    const data = await Framework.findOneBy({ id: frameworkId });
    if (data !== null) {
      await data.remove()

    }
    return data;
  }
}
