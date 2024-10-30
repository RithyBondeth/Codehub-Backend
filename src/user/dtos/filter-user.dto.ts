import { IsEnum, IsOptional } from "class-validator";
import { UserRoles } from "src/entities/user.entity";

export class FilterUserDto {
    @IsEnum(UserRoles)
    @IsOptional()
    role?: UserRoles;
}