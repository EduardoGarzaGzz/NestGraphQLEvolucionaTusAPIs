import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaginationArgs, SearchArgs } from '../common/dto/args'
import { User } from '../users/entities/user.entity'
import { CreateListInput } from './dto/create-list.input'
import { UpdateListInput } from './dto/update-list.input'
import { List } from './entities/list.entity'

@Injectable()
export class ListsService {
	constructor(
		@InjectRepository( List )
		private readonly listRepository: Repository<List>
	) {}

	public async create( createListInput: CreateListInput, user: User ): Promise<List> {
		const newList = this.listRepository.create( {
			...createListInput,
			user
		} )
		return await this.listRepository.save( newList )
	}

	public async findAll( user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<List[]> {
		const { offset, limit } = paginationArgs
		const { search }        = searchArgs
		const queryBuilder      = this.listRepository.createQueryBuilder()
			.take( limit )
			.skip( offset )
			.where( `"userId" = :userId`, { userId: user.id } )

		if ( search ) {
			queryBuilder.andWhere( 'LOWER(name) like :name', { name: `%${ search }%` } )
		}

		return queryBuilder.getMany()
	}

	public async findOne( id: string, user: User ): Promise<List> {
		const list = await this.listRepository.findOneBy( { id, user: { id: user.id } } )
		if ( !list ) throw new NotFoundException( `List with id: ${ id } not found` )
		return list
	}

	public async update( id: string, updateListInput: UpdateListInput, user: User ): Promise<List> {
		await this.findOne( id, user )
		const list = await this.listRepository.preload( { ...updateListInput, user } )
		if ( !list ) throw new NotFoundException( `List with id: ${ id } not found` )
		return this.listRepository.save( list )
	}

	public async remove( id: string, user: User ): Promise<List> {
		const list = await this.findOne( id, user )
		await this.listRepository.remove( list )
		return { ...list, id }
	}

	public async listCountByUser( user: User ): Promise<number> {
		return this.listRepository.count( {
			where: {
				user: {
					id: user.id
				}
			}
		} )
	}
}
