import { Module, ValidationPipe } from '@nestjs/common';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controllers/projects.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Project } from './entities/project.entity';
import { JwtModule } from '@nestjs/jwt';
import { ProjectUser } from './entities/project-user.entity';
import { ProjectUsersController } from './controllers/project-users.controller';
import { ProjectUsersService } from './services/project-users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project, ProjectUser]),
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [ProjectsController, ProjectUsersController],
  providers: [
    ProjectsService,
    ProjectUsersService,
    {
      provide: 'OK',
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
  ],
})
export class ProjectsModule {}
