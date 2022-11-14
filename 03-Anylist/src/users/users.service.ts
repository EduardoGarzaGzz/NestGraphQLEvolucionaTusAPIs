import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { InjectRepository }                                                      from '@nestjs/typeorm'
import * as bcrypt                                                               from 'bcrypt'
import { Repository }                                                            from 'typeorm'
import { SignupInput }                                                           from '../auth/dto/inputs/signup.input'
import { ValidRoles }                                                            from '../auth/enums/valid-roles.enum'
import { UpdateUserInput }                                                       from './dto/inputs/update-user.input'
import { User }                                                                  from './entities/user.entity'

@Injectable()
export class UsersService {
	private logger: Logger = new Logger( 'UsersService' )

	constructor(
		@InjectRepository( User )
		private readonly userRepository: Repository<User>
	) {}

	public async create( signupInput: SignupInput ): Promise<User> {
		try {
			const newUser = this.userRepository.create( {
				...signupInput,
				password: bcrypt.hashSync( signupInput.password, 10 )
			} )
			return await this.userRepository.save( newUser )
		} catch ( err ) {
			this.handleDBErrors( err )
		}
	}

	public async findAll( roles: ValidRoles[] ): Promise<User[]> {
		if ( roles.length === 0 ) {
			return await this.userRepository.find()
		}

		return await this.userRepository.createQueryBuilder()
			.andWhere( 'ARRAY[roles] && ARRAY[:...roles]' )
			.setParameter( 'roles', roles )
			.getMany()
	}

	public async findOne( id: string ): Promise<User> {
		try {
			return this.userRepository
				.findOneByOrFail( { id } )
		} catch ( error ) {
			this.handleDBErrors( error )
		}
	}

	public async findOneByEmail( email: string ): Promise<User> {
		try {
			return await this.userRepository.findOneByOrFail( { email } )
		} catch ( error ) {
			throw new BadRequestException( `The email: ${ email } not found` )
		}
	}

	public async findOneById( id: string ): Promise<User> {
		try {
			return await this.userRepository.findOneByOrFail( { id } )
		} catch ( error ) {
			throw new BadRequestException( `The id: ${ id } not found` )
		}
	}

	public async update( id: string, updateUserInput: UpdateUserInput, currentUser: User ): Promise<User> {
		try {
			const user        = await this.userRepository.preload( { ...updateUserInput } )
			user.lastUpdateBy = currentUser
			return this.userRepository.save( user )
		} catch ( e ) {
			this.handleDBErrors( e )
		}
	}

	public async block( id: string, currentUser: User ): Promise<User> {
		const userToBlock        = await this.findOneById( id )
		userToBlock.isActive     = false
		userToBlock.lastUpdateBy = currentUser
		return await this.userRepository.save( userToBlock )
	}

	private handleDBErrors( error: any ): never {
		console.log( { error } )
		if ( error.code === '23505' ) throw new BadRequestException( error.detail.replace( 'Key', '' ) )
		if ( error.code === 'error-001' ) throw new BadRequestException( error.detail )

		this.logger.error( error )
		throw new InternalServerErrorException( `Please check server logs` )
	}
}
