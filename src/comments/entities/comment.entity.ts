import { ApiProperty } from '@nestjs/swagger/dist';
import { Article } from 'src/articles/entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { IsNull } from 'typeorm/find-options/operator/IsNull';

@Entity()
export class Comment extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  content: string;

  @ApiProperty()
  @Column({ type: 'timestamptz', default: new Date() })
  created_at: Date;

  @ApiProperty()
  @Column({ type: 'timestamptz', default: null })
  updated_at: Date;

  @ApiProperty()
  @Column({ type: 'timestamptz', default: null , nullable : true})
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user : User ;

  @ManyToOne(() => Article, (article) => article.comments)
  article : Article ;
}
