import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

// const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
class TodoAccess {
  dynamoClient: DocumentClient = new AWS.DynamoDB.DocumentClient()
  
  todoTable = process.env.TODOS_TABLE

  async create(body: TodoItem) {
    try {
      const params = {
        TableName: this.todoTable,
        Item: body
      }
      await this.dynamoClient.put(params).promise()
      return body
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getAll(userId: string) {
    const params = {
      TableName: this.todoTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const { Items } = await this.dynamoClient.query(params).promise()

    return Items
  }

  async update(body: TodoUpdate, todoId: string, userId: string) {
    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #a = :a, #b = :b, #c = :c',
      ExpressionAttributeNames: {
        '#a': 'name',
        '#b': 'dueDate',
        '#c': 'done'
      },
      ExpressionAttributeValues: {
        ':a': body['name'],
        ':b': body['dueDate'],
        ':c': body['done']
      },
      ReturnValues: 'ALL_NEW'
    }

    const { Attributes } = await this.dynamoClient.update(params).promise()

    return Attributes
  }

  async delete(todoId: string, userId: string) {
    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }

    await this.dynamoClient.delete(params).promise()

    return ''
  }
}

export default new TodoAccess()
