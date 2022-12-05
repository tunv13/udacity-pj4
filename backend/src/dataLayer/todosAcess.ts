import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import * as AWSXRay from 'aws-xray-sdk'

const logger = createLogger('TodosAccess')

// Xray
class TodoAccess {

  dynamoClient: DocumentClient = new AWS.DynamoDB.DocumentClient({
    service: new AWS.DynamoDB()
  })

  todoTable = process.env.TODOS_TABLE
  constructor() {
    AWSXRay.captureAWSClient((this.dynamoClient as any).service);
  }
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

  async updateTodoAttachment(todoId: string, userId: string, attachmentUrl: string): Promise<void> {
    await this.dynamoClient.update({
      TableName: this.todoTable,
      Key: {
        todoId,
        userId
      },
      UpdateExpression: 'SET attachmentUrl = :attachment',
      ExpressionAttributeValues: {
        ':attachment': attachmentUrl
      }
    }).promise()
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
        '#d': 'progress'
      },
      ExpressionAttributeValues: {
        ':a': body['name'],
        ':b': body['dueDate'],
        ':c': body['done'],
        ':d': body['progress']
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
