import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-github2"
import { AuthService } from "../auth.service"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor(private authService: AuthService, private configService: ConfigService) {
        super({
            clientID: configService.get<string>("GITHUB_CLIENT_ID"),
            clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET"),
            callbackURL: configService.get<string>("GITHUB_CALLBACK_URL"),
            scope: ['user:email'],
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        try {
            const google_profile = await this.authService.validateGithubUser(profile);
            done(null, { user: google_profile.user, token: google_profile.token });
        } catch (err) {
            done(err, false);
        }
    }
}