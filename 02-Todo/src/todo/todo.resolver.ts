import { ParseIntPipe }                         from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { StatusArgs }                           from './dto/args/statusArgs'
import { CreateTodoInput }                      from './dto/inputs/create-todo.input'
import { UpdateTodoInput }                      from './dto/inputs/update-todo.input'
import { Todo }                                 from './entities/todo.entity'
import { TodoService }                          from './todo.service'
import { AggregationsType }                     from './types/aggregations.type'

@Resolver()
export class TodoResolver {

	public constructor(
		private readonly todoService: TodoService
	) {}

	@Query( () => [ Todo ], { name: 'todos' } )
	public findAll(
		@Args() statusArgs: StatusArgs
	): Todo[] {
		return this.todoService.findAll( statusArgs )
	}

	@Query( () => Todo, { name: 'todo' } )
	public findOne(
		@Args( 'id', { type: () => Int } ) id: number
	): Todo {
		return this.todoService.findOne( id )
	}

	@Mutation( () => Todo, { name: 'createTodo' } )
	public createTodo(
		@Args( 'createTodoInput' ) createTodoInput: CreateTodoInput
	): Todo {
		return this.todoService.create( createTodoInput )
	}

	@Mutation( () => Todo, { name: 'updateTodo' } )
	public updateTodo(
		@Args( 'updateTodoInput' ) updateTodoInput: UpdateTodoInput
	): Todo {
		return this.todoService.update( updateTodoInput )
	}

	@Mutation( () => Boolean, { name: 'removeTodo' } )
	public removeTodo(
		@Args( 'id', { type: () => Int }, ParseIntPipe ) id: number
	): boolean {
		return this.todoService.delete( id )
	}

	@Query( () => Int, { name: 'totalTodos' } )
	public totalTodos(): number {
		return this.todoService.totalTodos
	}

	@Query( () => Int, { name: 'completedTodos' } )
	public completedTodos(): number {
		return this.todoService.completedTodos
	}

	@Query( () => Int, { name: 'pendingTodos' } )
	public pendingTodos(): number {
		return this.todoService.pendingTodos
	}

	@Query( () => AggregationsType )
	public aggregations(): AggregationsType {
		return {
			total    : this.todoService.totalTodos,
			pending  : this.todoService.pendingTodos,
			completed: this.todoService.completedTodos
		}
	}
}
