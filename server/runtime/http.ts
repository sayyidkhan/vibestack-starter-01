import type express from 'express'

export type HttpResult<T = unknown> = {
  status: number
  body?: T
}

export function sendHttpResult(res: express.Response, result: HttpResult) {
  if (result.status === 204) {
    res.status(204).send()
    return
  }
  res.status(result.status).json(result.body ?? {})
}
