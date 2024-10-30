import { UserRoles } from "src/entities/user.entity"

export type UserType = {
    username: string
    sub: number
    role: UserRoles
    iat: number
    exp: number
}