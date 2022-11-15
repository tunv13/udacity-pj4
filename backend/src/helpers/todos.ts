import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import {parseUserId} from "../auth/utils";
const uuidv4 = require('uuid/v4');

// TODO: Implement businessLogic
const todoAccess = new TodoAccess();

const createTodo = (body: CreateTodoRequest, token: string) => {
    const s3BucketName = process.env.S3_BUCKET_NAME;
    const todoId = uuidv4()
    const userId = parseUserId(token);
    
    return toDoAccess.createToDo({
        userId,
        todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...body,
    });
}
export { createTodo }
