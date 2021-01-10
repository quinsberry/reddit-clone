export interface IResponse<D> {
  code: number
  status: 'success' | 'error' | 'warning'
  data: D
}
