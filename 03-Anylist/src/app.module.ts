import { ApolloDriver, ApolloDriverConfig }          from '@nestjs/apollo'
import { Module }                                    from '@nestjs/common'
import { ConfigModule }                              from '@nestjs/config'
import { GraphQLModule }                             from '@nestjs/graphql'
import { JwtService }                                from '@nestjs/jwt'
import { TypeOrmModule }                             from '@nestjs/typeorm'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { join }                                      from 'path'
import { AuthModule }                                from './auth/auth.module'
import { ItemsModule }                               from './items/items.module'
import { UsersModule }                               from './users/users.module'

@Module( {
	imports    : [
		ConfigModule.forRoot(),
		GraphQLModule.forRootAsync<ApolloDriverConfig>( {
			driver    : ApolloDriver,
			imports   : [ AuthModule ],
			inject    : [ JwtService ],
			useFactory: async ( jwtService: JwtService ) => ( {
				autoSchemaFile: join( process.cwd(), 'src/schema.gql' ),
				playground    : false,
				plugins       : [
					ApolloServerPluginLandingPageLocalDefault
				],
				context( { req } ) {
					const token = req.headers.authorization?.replace( 'Bearer ', '' )
					if ( !token ) throw Error( 'Token needed' )

					const payload = jwtService.decode( token )
					if ( !payload ) throw Error( 'Token not valid' )
				}
			} )
		} ),
//		GraphQLModule.forRoot<ApolloDriverConfig>( {
//			driver        : ApolloDriver,
//			autoSchemaFile: join( process.cwd(), 'src/schema.gql' ),
//			playground    : false,
//			plugins       : [
//				ApolloServerPluginLandingPageLocalDefault
//			]
//		} ),
		TypeOrmModule.forRoot( {
			type            : 'postgres',
			host            : process.env.DB_HOST,
			port            : Number.parseInt( process.env.DB_PORT, 10 ),
			username        : process.env.DB_USERNAME,
			password        : process.env.DB_PASSWORD,
			database        : process.env.DB_NAME,
			synchronize     : true,
			autoLoadEntities: true
		} ),
		ItemsModule,
		UsersModule,
		AuthModule
	],
	controllers: [],
	providers  : []
} )
export class AppModule {}
