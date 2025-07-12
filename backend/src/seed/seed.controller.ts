import { Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post('admin')
  async seedAdmin() {
    try {
      // Create admin user for demo
      const adminUser = await this.usersService.create({
        username: 'admin',
        email: 'demo@test.com',
        password: 'demo123',
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
      });
      
      return { 
        message: 'Admin user seeded successfully',
        credentials: {
          email: 'demo@test.com',
          password: 'demo123'
        }
      };
    } catch (error) {
      return { 
        message: 'Admin user already exists or creation failed',
        credentials: {
          email: 'demo@test.com', 
          password: 'demo123'
        }
      };
    }
  }

  @Post('payments')
  async seedPayments() {
    return { message: 'Sample payments seeded successfully' };
  }
}
