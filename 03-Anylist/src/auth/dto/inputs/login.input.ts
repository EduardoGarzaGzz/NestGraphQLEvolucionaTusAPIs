import { Field, InputType }   from '@nestjs/graphql'
import { IsEmail, MinLength } from 'class-validator'

@InputType()
export class LoginInput {
	@Field( () => String )
	@IsEmail()
	public email: string

	@Field( () => String )
	@MinLength( 6 )
	public password: string
}
