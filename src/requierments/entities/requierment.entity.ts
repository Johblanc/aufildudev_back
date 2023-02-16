import { ApiProperty } from '@nestjs/swagger';
import { Article } from 'src/articles/entities/article.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';


@Entity("requierments")
export class Requierment extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @OneToMany(() => Article, (article) => article.requirements)
    article : Article

    @OneToMany(() => Article, (article) => article.needed_for)
    article_needed : Article

}
