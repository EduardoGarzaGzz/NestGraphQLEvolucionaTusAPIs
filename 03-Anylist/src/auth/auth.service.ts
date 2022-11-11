import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService }                                             from '@nestjs/jwt'
import * as bycrypt                                               from 'bcrypt'
import { User }                                                   from '../users/entities/user.entity'
import { UsersService }                                           from '../users/users.service'
import { LoginInput }                                             from './dto/inputs/login.input'
import { SignupInput }                                            from './dto/inputs/signup.input'
import { AuthResponse }                                           from './types/auth-response.type'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	public async signup( signupInput: SignupInput ): Promise<AuthResponse> {
		const user = await this.usersService.create( signupInput )

		return {
			token: this.getJwtToken( user.id ),
			user
		}
	}

	public async login( loginInput: LoginInput ): Promise<AuthResponse> {
		const { email, password } = loginInput
		const user                = await this.usersService.findOneByEmail( email )

		if ( !bycrypt.compareSync( password, user.password ) ) {
			throw new BadRequestException( 'Email / Password do not match' )
		}

		return {
			token: this.getJwtToken( user.id ),
			user
		}
	}

	public async validateUser( id: string ): Promise<User> {
		const user = await this.usersService.findOneById( id )

		if ( !user.isActive ) throw new UnauthorizedException( `User is inactive, talk with an admin` )

		delete user.password
		return user
	}

	public async revalidateToken( user: User ): Promise<AuthResponse> {
		return {
			token: this.getJwtToken( user.id ),
			user
		}
	}

	private getJwtToken( userId: string ): string {
		return this.jwtService.sign( { id: userId } )
	}
}
