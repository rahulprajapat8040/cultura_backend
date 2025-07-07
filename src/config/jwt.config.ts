import { ConfigService } from "@nestjs/config";

export const jwtConfig = (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_ACCESS_TOKEN_KEY') || 'fallback-secret',
    signOptions: { expiresIn: '15d' }
})