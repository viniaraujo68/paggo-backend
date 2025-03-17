import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.getUserByName(username);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isMatch = await bcrypt.compare(pass, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid password');
      }
      const payload = { name: user.name, sub: user.id };
      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {
      console.error('Sign-in error:', error.message);
      throw error;
    }
  }

  async register(username: string, pass: string): Promise<{ access_token: string }> {
    try {
      const hashedPassword = await bcrypt.hash(pass, 10);
      const user = await this.userService.createUser(username, hashedPassword);

      const payload = { name: user.name, sub: user.id };
      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {

      if (error.message == 'User with this name already exists') {
        throw new ConflictException('Username already exists');
      } else {
		throw new InternalServerErrorException('Could not register user');
	  }
    }
  }
}