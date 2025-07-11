const { 
  Controller, 
  Get, 
  Post, 
  Req, 
  Param, 
  Put, 
  Delete, 
  UseGuards 
} = require('@nestjs/common');
const { JwtAuthGuard } = require('../common/guards/jwt-auth.guard');
const { RolesGuard } = require('../common/guards/roles.guard');
const { Roles } = require('../common/decorators/roles.decorator');
const { UsersService } = require('./users.service');

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  static get parameters() {
    return [UsersService];
  }

  @Post()
  @Roles('admin')
  async create(req) {
    return this.usersService.create(req.body);
  }

  @Get()
  @Roles('admin', 'viewer')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'viewer')
  async findOne(req) {
    return this.usersService.findById(req.params.id);
  }

  @Put(':id')
  @Roles('admin')
  async update(req) {
    return this.usersService.update(req.params.id, req.body);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(req) {
    return this.usersService.remove(req.params.id);
  }
}

module.exports = { UsersController };
