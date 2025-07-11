const { Injectable } = require('@nestjs/common');

@Injectable()
class AppService {
  getHello() {
    return 'Hello World! Database connection configured for MongoDB.';
  }
}

module.exports = { AppService };
