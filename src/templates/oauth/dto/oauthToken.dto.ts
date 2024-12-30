export interface OAuthTokenDTO {
    accessToken: string;
    refreshToken?: string;
    provider: string;
    userId: string;
}  