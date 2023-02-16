import { ApiProperty } from '@nestjs/swagger';
import { Article } from 'src/articles/entities/article.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity()
@Unique(['pseudo', 'email'])
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty()
  @Column({ name: 'pseudo', type: 'varchar' })
  pseudo: string;

  @ApiProperty()
  @Column({ name: 'email', type: 'varchar' })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  password: string;

  @ApiProperty()
  @Column({ type: 'int', default: 1 })
  access_lvl: number;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments : Comment[] ;

  @OneToMany(() => Article, (article) => article.user)
  articles : Article[] ;
}
