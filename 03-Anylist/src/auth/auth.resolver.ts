import { UseGuards }                       from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User }                            from '../users/entities/user.entity'
import { AuthService }                     from './auth.service'
import { CurrentUser }                     from './decorators/current-user.decorator'
import { LoginInput }                      from './dto/inputs/login.input'
import { SignupInput }                     from './dto/inputs/signup.input'
import { ValidRoles }                      from './enums/valid-roles.enum'
import { JwtAuthGuard }                    from './guards/jwt-auth.guard'
import { AuthResponse }                    from './types/auth-response.type'

@Resolver( () => AuthResponse )
export class AuthResolver {
	constructor(
		private readonly authService: AuthService
	) {}

	@Mutation( () => AuthResponse, { name: 'signup' } )
	public async signup(
		@Args( 'signupInput' ) signupInput: SignupInput
	): Promise<AuthResponse> {
		return await this.authService.signup( signupInput )
	}

	@Mutation( () => AuthResponse, { name: 'login' } )
	public async login(
		@Args( 'loginInput' ) loginInput: LoginInput
	): Promise<AuthResponse> {
		return await this.authService.login( loginInput )
	}

	@Query( () => AuthResponse, { name: 'revalidate' } )
	@UseGuards( JwtAuthGuard )
	public async revalidateToken(
		@CurrentUser( [ ValidRoles.ADMIN ] ) user: User
	): Promise<AuthResponse> {
		return await this.authService.revalidateToken( user )
	}
}
