import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'

@Injectable()
export class EmployerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest()
    if (user?.role !== 'employer' && user?.role !== 'admin') {
      throw new ForbiddenException('Only employer accounts can perform this action')
    }
    return true
  }
}
