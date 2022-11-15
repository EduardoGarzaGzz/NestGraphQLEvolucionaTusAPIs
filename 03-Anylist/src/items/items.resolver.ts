import { ParseUUIDPipe, UseGuards }            from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser }                         from '../auth/decorators/current-user.decorator'
import { JwtAuthGuard }                        from '../auth/guards/jwt-auth.guard'
import { User }                                from '../users/entities/user.entity'
import { CreateItemInput }                     from './dto/inputs/create-item.input'
import { UpdateItemInput }                     from './dto/inputs/update-item.input'
import { Item }                                from './entities/item.entity'
import { ItemsService }                        from './items.service'

@Resolver( () => Item )
@UseGuards( JwtAuthGuard )
export class ItemsResolver {
	constructor( private readonly itemsService: ItemsService ) {}

	@Mutation( () => Item )
	public async createItem(
		@Args( 'createItemInput' ) createItemInput: CreateItemInput,
		@CurrentUser() user: User
	): Promise<Item> {
		return this.itemsService.create( createItemInput, user )
	}

	@Query( () => [ Item ], { name: 'items' } )
	public async findAll(
		@CurrentUser() user: User
	): Promise<Item[]> {
		return await this.itemsService.findAll( user )
	}

	@Query( () => Item, { name: 'item' } )
	public async findOne(
		@Args( 'id', { type: () => ID }, ParseUUIDPipe ) id: string,
		@CurrentUser() user: User
	) {
		return await this.itemsService.findOne( id, user )
	}

	@Mutation( () => Item )
	public async updateItem(
		@Args( 'updateItemInput' ) updateItemInput: UpdateItemInput,
		@CurrentUser() user: User
	): Promise<Item> {
		return this.itemsService.update( updateItemInput.id, updateItemInput, user )
	}

	@Mutation( () => Item )
	public async removeItem(
		@Args( 'id', { type: () => ID } ) id: string,
		@CurrentUser() user: User
	) {
		return this.itemsService.remove( id, user )
	}
}
