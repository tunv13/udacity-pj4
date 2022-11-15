import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { Types } from 'aws-sdk/clients/s3'
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
class TodoAccess {
  dynamoClient: DocumentClient = new AWS.DynamoDB.DocumentClient()
  s3Client: Types = new AWS.S3({ signatureVersion: 'v4' })
  todoTable = process.env.TODOS_TABLE
  s3BucketName = process.env.S3_BUCKET_NAME

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
}

export default new TodoAccess()
