import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class HelloWorldResolver {
	@Query( () => String, { name: 'hola', description: 'Hola mundo mensaje' } )
	public helloWorld(): string {
		return 'hello world'
	}

	@Query( () => Float, { name: 'randomNumber' } )
	public getRandomNumber(): number {
		return Math.random() * 100
	}

	@Query( () => Int, { name: 'randomNumberZeroTo', description: 'From zero t argument to (default 6)' } )
	public getRandomNumberZeroTo(
		@Args( 'to', { type: () => Int, nullable: true } ) to: number = 6
	): number {
		return Math.floor( Math.random() * to ) + 1
	}
}
