import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = async (configServive: ConfigService): Promise<JwtModuleOptions> => ({
  secret: configServive.get<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: configServive.get<string>('JWT_EXPIRE_IN'),
  },
});
