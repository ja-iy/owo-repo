
// httpm method information
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE'] as const
export type HttpMethod = typeof HTTP_METHODS[number]
export const HTTP_METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])