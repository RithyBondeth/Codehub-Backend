import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";
import { UserType } from "../types/user.type";

export const User = createParamDecorator((data, context: ExecutionContext): UserType => {
    const requerst = context.switchToHttp().getRequest()
    const user = requerst.user
    if(!user) throw new NotFoundException("There's no token")
   
    return user
})