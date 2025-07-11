const { Injectable, CanActivate, ExecutionContext } = require('@nestjs/common');
const { Reflector } = require('@nestjs/core');

@Injectable()
class RolesGuard {
  constructor(reflector) {
    this.reflector = reflector;
  }

  static get parameters() {
    return [Reflector];
  }

  canActivate(context) {
    const requiredRoles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

module.exports = { RolesGuard };
