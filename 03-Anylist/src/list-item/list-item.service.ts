import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaginationArgs, SearchArgs } from '../common/dto/args'
import { List } from '../lists/entities/list.entity'
import { CreateListItemInput } from './dto/create-list-item.input'
import { UpdateListItemInput } from './dto/update-list-item.input'
import { ListItem } from './entities/list-item.entity'

@Injectable()
export class ListItemService {
	constructor(
		@InjectRepository( ListItem )
		private readonly listItemRepository: Repository<ListItem>
	) {}

	public async create( createListItemInput: CreateListItemInput ): Promise<ListItem> {
		const { listId, itemId, ...rest } = createListItemInput
		const newListItem                 = this.listItemRepository.create( {
			...rest,
			list: { id: listId },
			item: { id: itemId }
		} )
		return await this.listItemRepository.save( newListItem )
	}

	public async findAll( list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<ListItem[]> {
		const { offset, limit } = paginationArgs
		const { search }        = searchArgs
		const queryBuilder      = this.listItemRepository.createQueryBuilder()
			.take( limit )
			.skip( offset )
			.where( `"listId" = :listId`, { listId: list.id } )

		if ( search ) {
			queryBuilder.andWhere( 'LOWER(item.name) like :name', { name: `%${ search }%` } )
		}

		return queryBuilder.getMany()
	}

	public async findOne( id: string ): Promise<ListItem> {
		const listItem = await this.listItemRepository.findOne( {
			where: {
				id
			}
		} )

		if ( !listItem ) throw new NotFoundException( `List item with id: ${ id } not found` )

		return listItem
	}

	public async update( id: string, updateListItemInput: UpdateListItemInput ): Promise<ListItem> {
		const { listId, itemId, ...rest } = updateListItemInput
		const queryBuilder                = this.listItemRepository.createQueryBuilder()
			.update()
			.set( rest )
			.where( 'id = :id', { id } )

		if ( listId ) queryBuilder.set( { list: { id: listId } } )
		if ( itemId ) queryBuilder.set( { item: { id: itemId } } )

		await queryBuilder.execute()
		return this.findOne( id )
	}

	public async remove( id: string ): Promise<ListItem> {
		throw new Error( `Not Implemented` )
	}

	public async countByList( list: List ): Promise<number> {
		return await this.listItemRepository.count( {
			where: {
				list: {
					id: list.id
				}
			}
		} )
	}
}
