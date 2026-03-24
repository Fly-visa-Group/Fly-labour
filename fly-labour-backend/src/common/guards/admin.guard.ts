import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest()
    if (user?.role !== 'admin') {
      throw new ForbiddenException('Chỉ admin mới có quyền thực hiện thao tác này')
    }
    return true
  }
}
