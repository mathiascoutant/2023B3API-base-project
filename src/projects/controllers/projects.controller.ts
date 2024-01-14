import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UsersService } from '../../users/services/users.service';
import { Request, Response } from 'express';
import { IsAuth } from '../../users/guards/auth.guard';
import { Payload } from '../../autres/payload';
import { GetProjectDto } from '../dto/get-project.dto';
import { IsRole } from '../../users/guards/role.guard';
import { Roles } from '../../users/roles/roles';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly userService: UsersService,
  ) {}

  @Roles('Admin')
  @UseGuards(IsAuth, IsRole)
  @Post()
  async create(
    @Body() { name, referringEmployeeId }: CreateProjectDto,
    @Res() res: Response,
  ) {
    const project = await this.projectService.create({
      name,
      referringEmployeeId,
    });

    if (project.isErr()) {
      if (project.error.type === 'UserNotFoundException') {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send('Referring employee not found');
      }

      if (project.error.type === 'UserNotAllowedException') {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send('Referring employee is not a project manager');
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
    }

    return res.status(HttpStatus.CREATED).json(project.content);
  }

  @UseGuards(IsAuth)
  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    const { id, role } = req['token'] as Payload;

    if (role === 'Employee') {
      const projects = await this.projectService.findAllFor(id);

      if (projects.isErr()) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('Une erreur est survenue');
      }

      return res.status(HttpStatus.OK).json(projects.content);
    }

    const projects = await this.projectService.findAll();

    if (projects.isErr()) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Une erreur est survenue');
    }

    return res.status(HttpStatus.OK).json(projects.content);
  }

  @UseGuards(IsAuth)
  @Get(':id')
  async findOne(
    @Param() { id: paramId }: GetProjectDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { id: tokenId, role } = req['token'] as Payload;

    if (role === 'Employee') {
      const project = await this.projectService.findOneFor(tokenId, paramId);

      if (project.isErr()) {
        if (project.error.type === 'ProjectNotFoundException') {
          return res.status(HttpStatus.FORBIDDEN).send('Forbidden');
        }

        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('Internal server error');
      }

      return res.status(HttpStatus.OK).json(project.content);
    }

    const project = await this.projectService.findOne(paramId);

    if (project.isErr()) {
      if (project.error.type === 'ProjectNotFoundException') {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send('This project does not exist');
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
    }

    return res.status(HttpStatus.OK).json(project.content);
  }
}
