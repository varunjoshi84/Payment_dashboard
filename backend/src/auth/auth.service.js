const { Injectable, UnauthorizedException } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');
const bcrypt = require('bcrypt');
const { UsersService } = require('../users/users.service');

@Injectable()
class AuthService {
  constructor(usersService, jwtService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  static get parameters() {
    return [UsersService, JwtService];
  }

  async validateUser(username, password) {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user) {
    const payload = { 
      username: user.username, 
      sub: user._id,
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    };
  }

  async loginWithCredentials(username, password) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.login(user);
  }

  async register(registerDto) {
    const userData = {
      ...registerDto,
      role: 'user', // Default role for new users
    };
    
    const user = await this.usersService.create(userData);
    return this.login(user);
  }
}

module.exports = { AuthService };
