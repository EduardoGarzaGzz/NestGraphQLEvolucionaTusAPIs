import { UseGuards } from '@nestjs/common'
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PaginationArgs, SearchArgs } from '../common/dto/args'
import { ListItem } from '../list-item/entities/list-item.entity'
import { ListItemService } from '../list-item/list-item.service'
import { User } from '../users/entities/user.entity'
import { CreateListInput } from './dto/create-list.input'
import { UpdateListInput } from './dto/update-list.input'
import { List } from './entities/list.entity'
import { ListsService } from './lists.service'

@Resolver( () => List )
@UseGuards( JwtAuthGuard )
export class ListsResolver {
	constructor(
		private readonly listsService: ListsService,
		private readonly listItemService: ListItemService
	) {}

	@Mutation( () => List )
	public async createList(
		@Args( 'createListInput' ) createListInput: CreateListInput,
		@CurrentUser() user: User
	): Promise<List> {
		return await this.listsService.create( createListInput, user )
	}

	@Query( () => [ List ], { name: 'lists' } )
	public async findAll(
		@CurrentUser() user: User,
		@Args() paginationArgs: PaginationArgs,
		@Args() searchArgs: SearchArgs
	): Promise<List[]> {
		return await this.listsService.findAll( user, paginationArgs, searchArgs )
	}

	@Query( () => List, { name: 'list' } )
	public async findOne(
		@Args( 'id', { type: () => ID } ) id: string,
		@CurrentUser() user: User
	): Promise<List> {
		return await this.listsService.findOne( id, user )
	}

	@Mutation( () => List )
	public async updateList(
		@Args( 'updateListInput' ) updateListInput: UpdateListInput,
		@CurrentUser() user: User
	): Promise<List> {
		return await this.listsService.update( updateListInput.id, updateListInput, user )
	}

	@Mutation( () => List )
	public async removeList(
		@Args( 'id', { type: () => ID } ) id: string,
		@CurrentUser() user: User
	): Promise<List> {
		return await this.listsService.remove( id, user )
	}

	@ResolveField( () => [ ListItem ], { name: 'items' } )
	public async getListItems(
		@Parent() list: List,
		@Args() paginationArgs: PaginationArgs,
		@Args() searchArgs: SearchArgs
	): Promise<ListItem[]> {
		return await this.listItemService.findAll( list, paginationArgs, searchArgs )
	}

	@ResolveField( () => Number, { name: 'totalItems' } )
	public async countListItemsByList(
		@Parent() list: List
	): Promise<number> {
		return await this.listItemService.countByList( list )
	}
}
