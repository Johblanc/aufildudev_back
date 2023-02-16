import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
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
}
