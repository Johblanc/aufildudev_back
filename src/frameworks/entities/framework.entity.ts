import { ApiProperty } from '@nestjs/swagger';
import { Article } from 'src/articles/entities/article.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('frameworks')
@Unique(['name'])
export class Framework extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty()
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ManyToMany(() => Article, (article) => article.frameworks)
  articles: Article[];
}
  

