import {Injectable, NotFoundException, ConflictException, InternalServerErrorException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(name: string, password: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { name } });
    if (existingUser) {
      throw new ConflictException('User with this name already exists');
    }

    try {
      return await this.prisma.user.create({
        data: { name, password: password },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new InternalServerErrorException('Could not fetch user');
    }
  }

  async getUserByName(name: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { name } });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      console.error('Error fetching user by name:', error);
      throw new InternalServerErrorException('Could not fetch user');
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Could not update user');
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException('Could not delete user');
    }
  }
}
