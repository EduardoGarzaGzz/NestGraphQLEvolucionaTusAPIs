import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ListItem } from '../../list-item/entities/list-item.entity'
import { User } from '../../users/entities/user.entity'

@Entity( { name: 'items' } )
@ObjectType()
export class Item {
	@PrimaryGeneratedColumn( 'uuid' )
	@Field( () => ID )
	public id: string

	@Column()
	@Field( () => String )
	public name: string

	@Column()
	@Field( () => Float )
	public quantity: number

	@Column( { nullable: true } )
	@Field( () => String, { nullable: true } )
	public quantityUnits?: string

	@Field( () => [ ListItem ] )
	@OneToMany( () => ListItem, ( listItem ) => listItem.list, { lazy: true } )
	public listItem: ListItem[]

	@ManyToOne( () => User, ( user ) => user.items, { nullable: false, lazy: true } )
	@Index( 'item-userId-idx' )
	@Field( () => User )
	public user: User
}
