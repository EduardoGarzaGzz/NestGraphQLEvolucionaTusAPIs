import { Injectable }           from '@nestjs/common'
import { ConfigService }        from '@nestjs/config'
import { PassportStrategy }     from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User }                 from '../../users/entities/user.entity'
import { AuthService }          from '../auth.service'
import { JwtPayload }           from '../interfaces/jwt.payload'

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService
	) {
		super( {
			secretOrKey   : configService.get( 'JWT_SECRET' ),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		} )
	}

	public async validate( payload: JwtPayload ): Promise<User> {
		const { id } = payload
		return await this.authService.validateUser( id )
	}
}
