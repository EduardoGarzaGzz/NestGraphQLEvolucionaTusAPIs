import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType( { description: 'Todo quick aggregations' } )
export class AggregationsType {
	@Field( () => Int )
	public total: number

	@Field( () => Int )
	public pending: number

	@Field( () => Int )
	public completed: number
}
