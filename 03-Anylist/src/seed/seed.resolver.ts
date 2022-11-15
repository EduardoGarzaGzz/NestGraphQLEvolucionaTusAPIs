import { Mutation, Resolver } from '@nestjs/graphql'
import { SeedService } from './seed.service'

@Resolver()
export class SeedResolver {
	constructor( private readonly seedService: SeedService ) {}

	@Mutation( () => Boolean, { name: 'executeSeed', description: 'Ejecuta la contruccin de la base de datos' } )
	public async executeSeed(): Promise<boolean> {
		return await this.seedService.executeSeed()
	}
}
