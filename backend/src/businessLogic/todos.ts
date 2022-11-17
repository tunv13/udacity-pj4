import TodosAccess from './todosAcess'
import { generateUploadUrl as generateUploadUrlAttachmentUtils } from '../dataLayer/attachmentUtils'

import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'
const uuidv4 = require('uuid/v4')

const getTodo = (token: string) => {
  const userId = parseUserId(token)
  return TodosAccess.getAll(userId)
}

const updateTodo = (body: UpdateTodoRequest, id: string, token: string) => {
  const userId = parseUserId(token)
  return TodosAccess.update(body, id, userId)
}

const createTodo = (body: CreateTodoRequest, token: string) => {
  const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
  const todoId = uuidv4()
  const userId = parseUserId(token)

  return TodosAccess.create({
    userId,
    todoId,
    attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
    createdAt: new Date().getTime().toString(),
    done: false,
    ...body
  })
}

const deleteToDo = (todoId: string, jwtToken: string) => {
  const userId = parseUserId(jwtToken)
  return TodosAccess.delete(todoId, userId)
}

const generateUploadUrl = (todoId: string) => {
  return generateUploadUrlAttachmentUtils(todoId)
}
export { createTodo, getTodo, updateTodo, deleteToDo, generateUploadUrl }
