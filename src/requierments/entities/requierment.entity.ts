import { ApiProperty } from '@nestjs/swagger';
import { Article } from 'src/articles/entities/article.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
} from 'typeorm';


@Entity("requierments")
export class Requierment extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @ManyToOne(() => Article, (article) => article.requirements)
    article : Article

    @ManyToOne(() => Article, (article) => article.needed_for)
    article_needed : Article

}