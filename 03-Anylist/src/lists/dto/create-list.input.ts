import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CreateListInput {
	@IsString()
	@IsNotEmpty()
	@Field( () => String )
	public name: string
}
