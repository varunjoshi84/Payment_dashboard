const { Controller, Post, Req } = require('@nestjs/common');
const { AuthService } = require('./auth.service');

@Controller('auth')
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  static get parameters() {
    return [AuthService];
  }

  @Post('login')
  async login(req) {
    const { username, password } = req.body;
    return this.authService.loginWithCredentials(username, password);
  }

  @Post('register')
  async register(req) {
    return this.authService.register(req.body);
  }
}

module.exports = { AuthController };
