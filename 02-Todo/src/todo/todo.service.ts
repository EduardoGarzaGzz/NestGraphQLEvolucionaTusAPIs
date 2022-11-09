import { Injectable, NotFoundException } from '@nestjs/common'
import { StatusArgs }                    from './dto/args/statusArgs'
import { CreateTodoInput }               from './dto/inputs/create-todo.input'
import { UpdateTodoInput }               from './dto/inputs/update-todo.input'
import { Todo }                          from './entities/todo.entity'

@Injectable()
export class TodoService {
	private todos: Todo[] = [
		{ id: 1, description: 'Piedra del alma', done: false },
		{ id: 2, description: 'Piedra del espacio', done: true },
		{ id: 3, description: 'Piedra del poder', done: false }
	]

	get totalTodos(): number {
		return this.todos.length
	}

	get completedTodos(): number {
		return this.todos.filter( t => t.done === true ).length
	}

	get pendingTodos(): number {
		return this.todos.filter( t => t.done === false ).length
	}

	public findAll( statusArgs: StatusArgs ): Todo[] {
		const { status } = statusArgs

		console.log( { status } )
		if ( status !== undefined || status !== null ) {
			return this.todos.filter( t => t.done === status )
		}

		return this.todos
	}

	public findOne( id: number ): Todo {
		const todo = this.todos.find( t => t.id === id )

		if ( !todo ) throw new NotFoundException( `Todo with id: ${ id } not found` )

		return todo
	}

	public create( createTodoInput: CreateTodoInput ): Todo {
		const todo       = new Todo()
		todo.description = createTodoInput.description
		todo.id          = Math.max( ...this.todos.map( t => t.id ), 0 ) + 1

		this.todos.push( todo )
		return todo
	}

	public update( updateTodoInput: UpdateTodoInput ): Todo {
		const { id, description, done } = updateTodoInput
		const updateTodo                = this.todos.find( t => t.id === id )

		if ( description ) updateTodo.description = description
		if ( done ) updateTodo.done = done

		this.todos = this.todos.map( todo => ( todo.id === id ) ? updateTodo : todo )

		return updateTodo
	}

	public delete( id: number ): boolean {
		const todo = this.findOne( id )
		this.todos = this.todos.filter( t => t.id !== id )

		return true
	}
}
