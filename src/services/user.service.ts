import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne(
      { email },
      { relations: ['tasks'] },
    );
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async updateUser(updateInfo, user) {
    try {
      await this.userRepository.update(user.id, updateInfo);
    } catch (err) {
      throw new HttpException(err.driverError.detail, HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this.userRepository.findOne(user.id);

    if (updatedUser) {
      return {
        ...updatedUser,
        password: undefined,
        confirmPassword: undefined,
      };
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async create(userData: {
    id?: number;
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
