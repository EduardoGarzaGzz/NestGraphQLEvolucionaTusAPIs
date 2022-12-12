import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Item } from '../../items/entities/item.entity'
import { List } from '../../lists/entities/list.entity'

@Entity( 'listItems' )
@ObjectType()
export class ListItem {
	@Field( () => ID )
	@PrimaryGeneratedColumn( 'uuid' )
	public id: string

	@Field( () => Number )
	@Column( { type: 'numeric' } )
	public quantity: number

	@Field( () => Boolean )
	@Column( { type: 'boolean' } )
	public completed: boolean

	@Field( () => List )
	@ManyToOne( () => List, ( list ) => list.listItem, { lazy: true } )
	public list: List

	@Field( () => Item )
	@ManyToOne( () => Item, ( item ) => item.listItem, { lazy: true } )
	public item: Item
}
