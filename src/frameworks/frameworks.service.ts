import { Injectable } from '@nestjs/common';
import { CreateFrameworkDto } from './dto/create-framework.dto';
import { UpdateFrameworkDto } from './dto/update-framework.dto';

@Injectable()
export class FrameworksService {
  create(createFrameworkDto: CreateFrameworkDto) {
    return 'This action adds a new framework';
  }

  findAll() {
    return `This action returns all frameworks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} framework`;
  }

  update(id: number, updateFrameworkDto: UpdateFrameworkDto) {
    return `This action updates a #${id} framework`;
  }

  remove(id: number) {
    return `This action removes a #${id} framework`;
  }
}
