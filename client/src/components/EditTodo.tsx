import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, patchTodo, uploadFile } from '../api/todos-api'
import { Todo } from '../types/Todo'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth
}

interface EditTodoState {
  file: any
  uploadState: UploadState
  progress: number
}

export class EditTodo extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    progress: 0,
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  componentDidMount(): void {
    const progress: number = Number(JSON.parse(localStorage.getItem('todoSelect') ?? '{progress:"0"}').progress)
    console.log(progress)
    this.setState({progress})
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(
        this.props.auth.getIdToken(),
        this.props.match.params.todoId
      )

      this.setUploadState(UploadState.UploadingFile)
      console.log('getUploadUrl', uploadUrl)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }
  handleChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (Number.isNaN(value)) return

    this.setState({
      progress: value <= 100 ? value : 100
    })
  }

  handleSaveProgress = async () => {
    const body: Todo = JSON.parse(localStorage.getItem('todoSelect') ?? '')

    body.progress = this.state.progress.toString()
   try {
    await patchTodo(
      this.props.auth.getIdToken(),
      this.props.match.params.todoId,
      body
    )
    alert('Update successful')
   } catch (error) {
    alert('Error update')
   }
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
        Update progress of Todo (%):
        <input
          type="text"
          value={this.state.progress}
          onChange={this.handleChangeProgress}
        />
        <Button onClick={this.handleSaveProgress}>Save progress</Button>
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {this.state.uploadState === UploadState.UploadingFile && (
          <p>Uploading file</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
