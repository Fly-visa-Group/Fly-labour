import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { UserRole } from '../../modules/users/user.entity'

@Injectable()
export class EmployerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest()
    if (user?.role !== UserRole.EMPLOYER && user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only employer accounts can perform this action')
    }
    return true
  }
}
