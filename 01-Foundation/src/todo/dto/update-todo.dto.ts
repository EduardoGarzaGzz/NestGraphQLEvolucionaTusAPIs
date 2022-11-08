import { PartialType }           from '@nestjs/mapped-types/dist'
import { IsBoolean, IsOptional } from 'class-validator'
import { CreateTodoDto }         from './create-todo.dto'

export class UpdateTodoDto extends PartialType( CreateTodoDto ) {

	@IsBoolean()
	@IsOptional()
	public done?: boolean
}
