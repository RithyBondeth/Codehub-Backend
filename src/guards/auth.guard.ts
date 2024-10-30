import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthJwtPayloadType } from "src/auth/types/auth-payload.type";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector, 
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(User) private userRepo: Repository<User>
    ){ }
    
    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.getAllAndOverride("roles", [
            context.getHandler(),
            context.getClass(),
        ])

        if(roles?.length > 0) {
            const request = context.switchToHttp().getRequest()
            const token = request?.headers?.authorization?.split("Bearer ")[1]
            if(!token) throw new NotFoundException(`Authorization token not found (Only ${roles} can access)`)

            try {
                const payload: AuthJwtPayloadType = await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>("JWT_SECRET") });
                const user = await this.userRepo.findOne({ where: { id: payload.sub } })
                if(!user) throw new NotFoundException("User not found")

                if(roles.includes(user.role)) return true
                
                throw new ForbiddenException("Insufficient permissions")
            } catch (error) {
                throw new UnauthorizedException("Invalid Token or Insufficient permissions")
            }
        }
    }
}