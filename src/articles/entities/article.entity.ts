
import { Category } from "src/categories/entities/category.entity";
import { Framework } from "src/frameworks/entities/framework.entity";
import { Language } from "src/languages/entities/language.entity";
import { Entity,Column,PrimaryGeneratedColumn,ManyToOne,OneToMany,ManyToMany,JoinTable, UpdateDateColumn, CreateDateColumn} from "typeorm";
import { Unique } from "typeorm/decorator/Unique";
import { BaseEntity } from "typeorm/repository/BaseEntity";
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/comments/entities/comment.entity';
import { Requierment } from 'src/requierments/entities/requierment.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('articles')
@Unique(['title'])
export class Article extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: 'varchar', name: 'title' })
    title: string;

    @ApiProperty()
    @Column({ type: 'varchar' })
    content: string;

    @ApiProperty()
    @Column({ type: 'boolean', default: false })
    is_public: boolean;

    @ApiProperty()
    @CreateDateColumn({ type: 'timestamptz', default: new Date() })
    created_at: Date;

    @ApiProperty()
    @UpdateDateColumn({ type: 'timestamptz', default: null, nullable: true })
    updated_at: Date;

    @ApiProperty()
    @Column({ type: 'timestamptz', default: null, nullable: true })
    deleted_at: Date;

    @ManyToOne(() => Comment, (comment) => comment.article)
    comments: Comment;

    @ManyToOne(() => User, (user) => user.articles)
    user: User;

    @OneToMany(() => Requierment, (requierment) => requierment.article)
    requirements: Requierment[];

    @OneToMany(() => Requierment, (requierment) => requierment.article_needed)
    needed_for : Requierment[] ;

    @ManyToMany(() => Language, (competence) => competence.articles)
    @JoinTable()
    languages: Language[];

    @ManyToMany(() => Category, (category) => category.articles)
    @JoinTable()
    categories: Category[];

    @ManyToMany(() => Framework, (framework) => framework.articles)
    @JoinTable()
    frameworks: Framework[];

    asObject(){
        return {
            id : this.id,
            title : this.title,
            content : this.comments,
            is_public : this.is_public,
            user_pseudo : this.user.pseudo,
            created_at : this.created_at,
            requirements : this.requirements.map(item => item.asRequirement()),
            needed_for : this.needed_for.map(item => item.asNeeded_for()),
            languages : this.languages,
            categories : this.categories,
            frameworks : this.frameworks
        }
    }
}
