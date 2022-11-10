import { ParseUUIDPipe }                       from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateItemInput }                     from './dto/inputs/create-item.input'
import { UpdateItemInput }                     from './dto/inputs/update-item.input'
import { Item }                                from './entities/item.entity'
import { ItemsService }                        from './items.service'

@Resolver( () => Item )
export class ItemsResolver {
	constructor( private readonly itemsService: ItemsService ) {}

	@Mutation( () => Item )
	public async createItem(
		@Args( 'createItemInput' ) createItemInput: CreateItemInput
	): Promise<Item> {
		return this.itemsService.create( createItemInput )
	}

	@Query( () => [ Item ], { name: 'items' } )
	public async findAll(): Promise<Item[]> {
		return await this.itemsService.findAll()
	}

	@Query( () => Item, { name: 'item' } )
	public async findOne(
		@Args( 'id', { type: () => ID }, ParseUUIDPipe ) id: string
	) {
		return await this.itemsService.findOne( id )
	}

	@Mutation( () => Item )
	public async updateItem(
		@Args( 'updateItemInput' ) updateItemInput: UpdateItemInput
	): Promise<Item> {
		return this.itemsService.update( updateItemInput.id, updateItemInput )
	}

	@Mutation( () => Item )
	public async removeItem(
		@Args( 'id', { type: () => ID } ) id: string
	) {
		return this.itemsService.remove( id )
	}
}
