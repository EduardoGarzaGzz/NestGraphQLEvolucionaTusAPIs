import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTodoDto }                 from './dto/create-todo.dto'
import { UpdateTodoDto }                 from './dto/update-todo.dto'
import { Todo }                          from './entities/todo.entity'

@Injectable()
export class TodoService {
	private todos: Todo[] = [
		{ id: 1, description: 'Piedra del Alma', done: false },
		{ id: 2, description: 'Piedra del Tiempo', done: false },
		{ id: 3, description: 'Piedra del Espacio', done: false }
	]

	create( createTodoDto: CreateTodoDto ) {
		const todo       = new Todo()
		todo.id          = Math.max( ...this.todos.map( t => t.id ), 0 ) + 1
		todo.description = createTodoDto.description
		todo.done        = false

		this.todos.push( todo )
		return todo
	}

	findAll(): Todo[] {
		return this.todos
	}

	findOne( id: number ) {
		const todo = this.todos.find( t => t.id === id )
		if ( !todo ) throw new NotFoundException( `TODO with id: ${ id } not found` )

		return todo
	}

	update( id: number, updateTodoDto: UpdateTodoDto ) {
		const { done, description } = updateTodoDto
		const todo                  = this.findOne( id )

		if ( done !== undefined ) todo.done = done
		if ( description !== undefined ) todo.description = description

		this.todos = this.todos.map( dbT => {
			if ( dbT.id === id ) return todo
			return dbT
		} )

		return todo
	}

	remove( id: number ) {
		this.findOne( id )
		return this.todos.filter( t => t.id !== id )
	}
}
