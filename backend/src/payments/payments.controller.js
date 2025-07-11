const { 
  Controller, 
  Get, 
  Post, 
  Req, 
  Param, 
  Query,
  UseGuards 
} = require('@nestjs/common');
const { JwtAuthGuard } = require('../common/guards/jwt-auth.guard');
const { RolesGuard } = require('../common/guards/roles.guard');
const { Roles } = require('../common/decorators/roles.decorator');
const { PaymentsService } = require('./payments.service');

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
class PaymentsController {
  constructor(paymentsService) {
    this.paymentsService = paymentsService;
  }

  static get parameters() {
    return [PaymentsService];
  }

  @Post()
  @Roles('admin', 'viewer')
  async create(req) {
    return this.paymentsService.create(req.body);
  }

  @Get()
  @Roles('admin', 'viewer')
  async findAll(req) {
    return this.paymentsService.findAll(req.query);
  }

  @Get('stats')
  @Roles('admin', 'viewer')
  async getStats() {
    return this.paymentsService.getStats();
  }

  @Post('seed')
  @Roles('admin')
  async createSampleData() {
    return this.paymentsService.createSampleData();
  }

  @Get(':id')
  @Roles('admin', 'viewer')
  async findOne(req) {
    return this.paymentsService.findById(req.params.id);
  }
}

module.exports = { PaymentsController };
