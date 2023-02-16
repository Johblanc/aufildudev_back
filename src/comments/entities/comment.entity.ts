import { ApiProperty } from '@nestjs/swagger/dist';
import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
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
  @Column({ type: 'timestamptz', default: IsNull() })
  updated_at: Date;

  @ApiProperty()
  @Column({ type: 'timestamptz', default: IsNull() })
  deleted_at: Date;
}
