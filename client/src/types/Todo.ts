export interface Todo {
  todoId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  progress: number
  attachmentUrl?: string
}
