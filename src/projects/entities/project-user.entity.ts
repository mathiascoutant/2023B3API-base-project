import {
  Column,
  DeepPartial,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ProjectUser {
  constructor(partial: DeepPartial<ProjectUser>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'date' })
  public startDate!: Date;

  @Column({ type: 'date' })
  public endDate!: Date;

  @Column({ type: 'uuid' })
  public projectId!: string;

  @Column({ type: 'uuid' })
  public userId!: string;

  @ManyToOne(() => Project, (project) => project.projectsUser)
  @JoinColumn({ name: 'projectId' })
  public project: Project;

  @ManyToOne(() => User, (user) => user.projectsUser)
  @JoinColumn({ name: 'userId' })
  public user: User;
}
