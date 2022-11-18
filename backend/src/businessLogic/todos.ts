import TodosAccess from '../dataLayer/todosAcess'
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
  const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
  const userId = parseUserId(token)
  const data = {
    ...body,
    attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${id}`
  }
  return TodosAccess.update(data, id, userId)
}

const createTodo = (body: CreateTodoRequest, token: string) => {
  // `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
  const todoId = uuidv4()
  const userId = parseUserId(token)

  return TodosAccess.create({
    userId,
    todoId,
    attachmentUrl: null,
    createdAt: new Date().getTime().toString(),
    done: false,
    ...body
  })
}

const deleteToDo = (todoId: string, jwtToken: string) => {
  const userId = parseUserId(jwtToken)
  return TodosAccess.delete(todoId, userId)
}

const generateUploadUrl = (todoId: string, token: string) => {
  const userId = parseUserId(token)

  return generateUploadUrlAttachmentUtils(todoId,userId)
}
export { createTodo, getTodo, updateTodo, deleteToDo, generateUploadUrl }
