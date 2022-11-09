import { Field, InputType, Int }                                              from '@nestjs/graphql'
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator'

@InputType()
export class UpdateTodoInput {
	@Field( () => Int )
	@IsInt()
	@IsNotEmpty()
	@Min( 1 )
	public id: number

	@Field( () => String, { description: 'What needs to be done?', nullable: true } )
	@IsString()
	@MaxLength( 20 )
	@IsOptional()
	public description?: string

	@Field( () => Boolean, { nullable: true } )
	@IsBoolean()
	@IsOptional()
	public done?: boolean
}
