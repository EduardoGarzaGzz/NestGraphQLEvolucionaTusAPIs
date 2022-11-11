import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { InjectRepository }                                                      from '@nestjs/typeorm'
import * as bcrypt                                                               from 'bcrypt'
import { Repository }                                                            from 'typeorm'
import { SignupInput }                                                           from '../auth/dto/inputs/signup.input'
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

	public async findAll(): Promise<User[]> {
		return []
	}

	public async findOne( id: string ): Promise<User> {
		try {
			return this.userRepository.findOneByOrFail( { id } )
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

	public block( id: string ): User {
		throw new Error( `Not implemented` )
	}

	private handleDBErrors( error: any ): never {
		console.log( { error } )
		if ( error.code === '23505' ) throw new BadRequestException( error.detail.replace( 'Key', '' ) )
		if ( error.code === 'error-001' ) throw new BadRequestException( error.detail )

		this.logger.error( error )
		throw new InternalServerErrorException( `Please check server logs` )
	}
}
