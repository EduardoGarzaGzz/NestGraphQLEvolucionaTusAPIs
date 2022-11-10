import { ValidationPipe } from '@nestjs/common'
import { NestFactory }    from '@nestjs/core'
import { AppModule }      from './app.module'

const PORT = 3000

async function bootstrap() {
	const app = await NestFactory.create( AppModule )

	app.useGlobalPipes(
		new ValidationPipe( {
			whitelist           : true,
			forbidNonWhitelisted: true
		} )
	)

	await app.listen( PORT )
}

bootstrap().then( () => {
	console.log( `Server enable in: http://localhost:${ PORT }` )
	console.log( `GraphQL endpoint in: http://localhost:${ PORT }/graphql` )
} )
