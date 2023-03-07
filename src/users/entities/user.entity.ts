/* Créé la table "users" et les relations avec les autres tables */


import { ApiProperty } from '@nestjs/swagger';
import { Article } from 'src/articles/entities/article.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer'; /* Pour le mot de passe */

@Entity('users')
@Unique(['pseudo', 'email'])
export class User extends BaseEntity { /* BaseEntity est exportée avec User = Raccourci */

  @ApiProperty() /* Pour swagger */
  @PrimaryGeneratedColumn({ type: 'int' }) /* Integer */
  id: number;

  @ApiProperty()
  @Column({ name: 'pseudo', type: 'varchar' })
  pseudo: string;

  @ApiProperty()
  @Column({ name: 'email', type: 'varchar' })
  email: string;

  @Exclude() /* Exclut la propriété "password" */
  @ApiProperty()
  @Column({ type: 'varchar' })
  password: string;

  @ApiProperty()
  @Column({ type: 'int', default: 1 })
  access_lvl: number;

  @OneToMany(() => Comment, (comment) => comment.user) /* Relation où chaque "Comment"(Many) conserve l'id du "user"(One) de son côté */
  comments: Comment[];

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];
}
