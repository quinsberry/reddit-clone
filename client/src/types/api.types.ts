interface DefaultResponse {
  code: number
  status: 'success' | 'error' | 'warning'
}

interface SuccessResponse<D> extends DefaultResponse {
  status: 'success'
  data: D
}

interface FailedResponse extends DefaultResponse {
  status: 'error'
  errors: object
  message: string
}

export type ServerResponse<D> = SuccessResponse<D> | FailedResponse
