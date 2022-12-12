import { Field, ID, InputType } from '@nestjs/graphql'
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator'

@InputType()
export class CreateListItemInput {

	@Min( 0 )
	@IsNumber()
	@IsOptional()
	@Field( () => Number, { nullable: true } )
	public quantity: number = 0

	@IsBoolean()
	@IsOptional()
	@Field( () => Boolean, { nullable: true } )
	public completed: boolean = false

	@IsUUID()
	@Field( () => ID )
	public listId: string

	@IsUUID()
	@Field( () => ID )
	public itemId: string
}
