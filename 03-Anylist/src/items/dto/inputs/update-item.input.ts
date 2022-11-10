import { Field, Float, ID, InputType, PartialType }             from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator'
import { CreateItemInput }                                      from './create-item.input'

@InputType()
export class UpdateItemInput extends PartialType( CreateItemInput ) {
	@Field( () => ID )
	@IsUUID()
	@IsNotEmpty()
	public id: string

	@Field( () => String, { nullable: true } )
	@IsString()
	@IsOptional()
	public name?: string

	@Field( () => Float, { nullable: true } )
	@IsPositive()
	@IsOptional()
	public quantity?: number

	@Field( () => String, { nullable: true } )
	@IsString()
	@IsOptional()
	public quantityUnist?: string
}
