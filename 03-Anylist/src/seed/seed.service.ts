import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Item } from '../items/entities/item.entity'
import { ItemsService } from '../items/items.service'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { SEED_ITEMS, SEED_USERS } from './data/seed-data'

@Injectable()
export class SeedService {
	private readonly isProd: boolean = false

	constructor(
		private readonly configService: ConfigService,
		@InjectRepository( Item )
		private readonly itemRepository: Repository<Item>,
		@InjectRepository( User )
		private readonly usersRepository: Repository<User>,
		private readonly usersService: UsersService,
		private readonly itemService: ItemsService
	) {
		this.isProd = configService.get( 'STATE' ) === 'prod'
	}

	public async executeSeed(): Promise<boolean> {
		if ( this.isProd ) throw new UnauthorizedException( `We cannot run SEED on Prod` )

		await this.deleteDatabase()
		const user = await this.loadUser()
		await this.loadItems( user )
		return true
	}

	private async deleteDatabase(): Promise<any> {
		await this.itemRepository.createQueryBuilder()
			.delete()
			.andWhere( {} )
			.execute()

		await this.usersRepository.createQueryBuilder()
			.delete()
			.andWhere( {} )
			.execute()
	}

	private async loadUser(): Promise<User> {
		const users = []
		for ( const user of SEED_USERS ) {
			users.push( this.usersService.create( user ) )
		}
		const result = await Promise.all( users )
		return result[ 0 ]
	}

	private async loadItems( user: User ): Promise<any> {
		const items = []
		for ( const item of SEED_ITEMS ) {
			items.push( this.itemService.create( { ...item, quantity: 0 }, user ) )
		}
		return await Promise.all( items )
	}
}
