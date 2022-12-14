import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Item } from '../../items/entities/item.entity'
import { List } from '../../lists/entities/list.entity'

@Entity( { name: 'entities' } )
@ObjectType()
export class User {
	@PrimaryGeneratedColumn( 'uuid' )
	@Field( () => ID )
	public id: string

	@Column()
	@Field( () => String )
	public fullName: string

	@Column( { unique: true } )
	@Field( () => String )
	public email: string

	@Column()
	public password: string

	@Column( { type: 'text', array: true, default: [ 'user' ] } )
	@Field( () => [ String ] )
	public roles: string[]

	@Column( {
		type   : 'boolean',
		default: true
	} )
	public isActive: boolean

	@OneToMany( () => Item, ( item ) => item.user, { lazy: true } )
	public items: Item[]

	@OneToMany( () => List, ( list ) => list.user, { lazy: true } )
	public lists?: List[]

	@ManyToOne( () => User, user => user.lastUpdateBy, { nullable: true, lazy: true } )
	@JoinColumn( { name: 'lastUpdateBy' } )
	@Field( () => User, { name: 'lastUpdateBy', nullable: true } )
	public lastUpdateBy?: User
}
