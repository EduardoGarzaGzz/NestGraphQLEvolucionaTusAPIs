import { ParseUUIDPipe, UseGuards }            from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser }                         from '../auth/decorators/current-user.decorator'
import { ValidRoles }                          from '../auth/enums/valid-roles.enum'
import { JwtAuthGuard }                        from '../auth/guards/jwt-auth.guard'
import { ValidRolesArg }                       from './dto/args/validRolesArg'
import { UpdateUserInput }                     from './dto/inputs/update-user.input'
import { User }                                from './entities/user.entity'
import { UsersService }                        from './users.service'

@Resolver( () => User )
@UseGuards( JwtAuthGuard )
export class UsersResolver {
	constructor( private readonly usersService: UsersService ) {}

	@Query( () => [ User ], { name: 'users' } )
	public async findAll(
		@Args() validRoles: ValidRolesArg,
		@CurrentUser( [ ValidRoles.ADMIN, ValidRoles.SUPER_USER ] ) user: User
	): Promise<User[]> {
		return await this.usersService.findAll( validRoles.roles )
	}

	@Query( () => User, { name: 'user' } )
	public async findOne(
		@Args( 'id', { type: () => ID }, ParseUUIDPipe ) id: string,
		@CurrentUser( [ ValidRoles.ADMIN, ValidRoles.SUPER_USER ] ) user: User
	): Promise<User> {
		return this.usersService.findOne( id )
	}

	@Mutation( () => User, { name: 'updateUser' } )
	public async updateUser(
		@Args( 'updateUserInput' ) updateUserInput: UpdateUserInput,
		@CurrentUser( [ ValidRoles.SUPER_USER, ValidRoles.ADMIN ] ) user: User
	): Promise<User> {
		return this.usersService.update( updateUserInput.id, updateUserInput, user )
	}

	@Mutation( () => User, { name: 'blockUser' } )
	public async blockUser(
		@Args( 'id', { type: () => ID } ) id: string,
		@CurrentUser( [ ValidRoles.ADMIN, ValidRoles.SUPER_USER ] ) user: User
	): Promise<User> {
		return this.usersService.block( id, user )
	}
}
