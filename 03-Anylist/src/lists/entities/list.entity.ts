import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ListItem } from '../../list-item/entities/list-item.entity'
import { User } from '../../users/entities/user.entity'

@ObjectType()
@Entity( { name: 'lists' } )
export class List {
	@Field( () => ID )
	@PrimaryGeneratedColumn( 'uuid' )
	public id: string

	@Column()
	@Field( () => String )
	public name: string

	@ManyToOne( () => User, ( user ) => user.lists, { nullable: false, lazy: true } )
	@Index( 'userId-list-index' )
	@Field( () => User )
	public user: User

	@OneToMany( () => ListItem, ( listItem ) => listItem.list, { lazy: true } )
	public listItem: ListItem
}
