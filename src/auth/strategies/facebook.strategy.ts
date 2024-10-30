import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor(private authService: AuthService, private configService: ConfigService) {
        super({
            clientID: configService.get<string>("FACEBOOK_CLIENT_ID"),
            clientSecret: configService.get<string>("FACEBOOK_CLIENT_SECRET"),
            callbackURL: configService.get<string>("FACEBOOK_CALLBACK_URL"),
            scope: 'email',
            profileFields: ['id', 'emails', 'name', 'photos'],
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        try {
            const { user, token } = await this.authService.validateFacebookUser(profile);
            done(null, { user, token });
        } catch (err) {
            done(err, false);
        }
    }
}