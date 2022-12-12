import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateListItemInput } from './dto/create-list-item.input'
import { UpdateListItemInput } from './dto/update-list-item.input'
import { ListItem } from './entities/list-item.entity'
import { ListItemService } from './list-item.service'

@Resolver( () => ListItem )
export class ListItemResolver {
	constructor( private readonly listItemService: ListItemService ) {}

	@Mutation( () => ListItem )
	public async createListItem(
		@Args( 'createListItemInput' ) createListItemInput: CreateListItemInput
	): Promise<ListItem> {
		return this.listItemService.create( createListItemInput )
	}

//  @Query(() => [ListItem], { name: 'listItem' })
//  findAll() {
//    return this.listItemService.findAll();
//  }

	@Query( () => ListItem, { name: 'listItem' } )
	public async findOne(
		@Args( 'id', { type: () => String } ) id: string
	): Promise<ListItem> {
		return this.listItemService.findOne( id )
	}

	@Mutation( () => ListItem )
	public async updateListItem(
		@Args( 'updateListItemInput' ) updateListItemInput: UpdateListItemInput
	) {
		return this.listItemService.update( updateListItemInput.id, updateListItemInput )
	}

	@Mutation( () => ListItem )
	removeListItem( @Args( 'id', { type: () => ID } ) id: string ) {
		return this.listItemService.remove( id )
	}
}
