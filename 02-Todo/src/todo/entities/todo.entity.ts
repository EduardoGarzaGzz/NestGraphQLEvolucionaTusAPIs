import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Todo {
	@Field( () => Int )
	public id: number

	@Field( () => String )
	public description: string

	@Field( () => Boolean )
	public done: boolean = false
}
