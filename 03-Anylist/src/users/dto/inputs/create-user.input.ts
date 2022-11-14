import { Field, InputType }               from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

@InputType()
export class CreateUserInput {
  @Field( () => String )
  @IsEmail()
  public email: string

  @Field( () => String )
  @IsNotEmpty()
  public fullName: string

  @Field( () => String )
  @MinLength( 6 )
  public password: string
}
