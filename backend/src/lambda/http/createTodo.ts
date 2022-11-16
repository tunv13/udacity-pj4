import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const token = event.headers.Authorization?.split(' ')[1]
      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      const toDoItem = await createTodo(newTodo, token)
      return {
        statusCode: 201,
        body: JSON.stringify({
          item: toDoItem
        })
      }
    } catch (error) {
      return {
        statusCode:400,
        body: JSON.stringify(error)
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
