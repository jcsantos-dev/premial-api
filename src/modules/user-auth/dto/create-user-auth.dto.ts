export class CreateUserAuthDto {
    userId: string; // FK a User
    authTypeId: number; // FK a AuthType
    authUserProviderId: string; // email o provider id
    passwordHash?: string; // opcional, nullable
}
