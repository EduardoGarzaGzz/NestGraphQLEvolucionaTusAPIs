import { registerEnumType } from '@nestjs/graphql'

export enum ValidRoles {
	ADMIN      = 'admin',
	USER       = 'user',
	SUPER_USER = 'super_user'
}

registerEnumType( ValidRoles, { name: 'ValidRoles', description: 'This is the roles permitting in the app' } )
