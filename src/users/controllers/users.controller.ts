import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Request, Response } from 'express';
import { IsAuth } from '../guards/auth.guard';
import { CreateUserDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { GetUserDto } from '../dto/get-user.dto';
import { AuthService } from '../services/auth.service';
import { Payload } from '../../autres/payload';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('auth/sign-up')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.authService.signup(createUserDto);

    if (user.isErr()) {
      const { error } = user;

      if (error.type === 'UserAlreadyExistException') {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('This user already exist');
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
    }

    return res.status(HttpStatus.CREATED).json(user.content);
  }

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const accessToken = await this.authService.login(loginDto);

    if (accessToken.isErr()) {
      const { error } = accessToken;
      if (error.type === 'WrongPasswordException') {
        return res.status(HttpStatus.UNAUTHORIZED).send('Wrong credentials');
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
    }

    return res
      .status(HttpStatus.CREATED)
      .json({ access_token: accessToken.content.access_token });
  }

  @UseGuards(IsAuth)
  @Get('me')
  async getSelf(@Req() req: Request, @Res() res: Response) {
    const { id } = req['token'] as Payload;

    const user = await this.userService.findOne(id);

    if (user.isErr()) {
      const { error } = user;

      if (error.type === 'UserNotFoundException') {
        return res.status(HttpStatus.NOT_FOUND).send(user.error);
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
    }

    return res.status(HttpStatus.OK).json(user.content);
  }

  @UseGuards(IsAuth)
  @Get()
  async getUsers(@Res() res: Response) {
    const users = await this.userService.findAll();

    if (users.isErr()) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
    }

    return res.status(HttpStatus.OK).json(users.content);
  }

  @UseGuards(IsAuth)
  @Get(':id')
  async getUser(@Param() { id }: GetUserDto, @Res() res: Response) {
    const user = await this.userService.findOne(id);

    if (user.isErr()) {
      const { error } = user;

      if (error.type === 'UserNotFoundException') {
        return res.status(HttpStatus.NOT_FOUND).send(user.error);
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
    }

    return res.status(HttpStatus.OK).json(user.content);
  }
}
