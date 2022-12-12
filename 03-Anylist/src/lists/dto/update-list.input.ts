import { Field, ID, InputType, PartialType } from '@nestjs/graphql'
import { IsUUID } from 'class-validator'
import { CreateListInput } from './create-list.input'

@InputType()
export class UpdateListInput extends PartialType( CreateListInput ) {
	@IsUUID()
	@Field( () => ID )
	public id: string
}
