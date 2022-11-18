import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
class TodoAccess {
  dynamoClient: DocumentClient = new AWS.DynamoDB.DocumentClient()
 
  todoTable = process.env.TODOS_TABLE

  async create(body: TodoItem) {
    try {
      logger.info('Create todo: ' + JSON.stringify(body));

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
    logger.info('getAll userID: ' + JSON.stringify(userId));
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
    logger.info('update : ' + JSON.stringify(body));
    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #a = :a, #b = :b, #c = :c, #d = :d',
      ExpressionAttributeNames: {
        '#a': 'name',
        '#b': 'dueDate',
        '#c': 'done',
        '#d': 'attachmentUrl'
      },
      ExpressionAttributeValues: {
        ':a': body['name'],
        ':b': body['dueDate'],
        ':c': body['done'],
        ':d': body['attachmentUrl']
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