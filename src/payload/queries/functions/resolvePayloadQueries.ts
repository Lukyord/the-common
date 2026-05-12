import { getErrorMessage } from '@/payload/queries/functions/getErrorMessage'

type PayloadQueryConfig<TData> = {
  errorMessage: string
  promise: Promise<TData>
}

type PayloadQueryConfigMap = Record<string, PayloadQueryConfig<unknown>>

type QueryData<TQuery> = TQuery extends PayloadQueryConfig<infer TData> ? TData : never

type ResolvedPayloadQueries<TQueries extends PayloadQueryConfigMap> = {
  data: {
    [Key in keyof TQueries]: QueryData<TQueries[Key]> | null
  }
  errors: Partial<Record<keyof TQueries, string>>
}

export async function resolvePayloadQueries<const TQueries extends PayloadQueryConfigMap>(
  queries: TQueries,
): Promise<ResolvedPayloadQueries<TQueries>> {
  const entries = Object.entries(queries) as [keyof TQueries, TQueries[keyof TQueries]][]

  const results = await Promise.all(
    entries.map(async ([key, { errorMessage, promise }]) => {
      try {
        return [key, { data: await promise, error: null as string | null }] as const
      } catch (error) {
        console.error(errorMessage, error)

        return [key, { data: null, error: getErrorMessage(error) }] as const
      }
    }),
  )

  const data = {} as ResolvedPayloadQueries<TQueries>['data']
  const errors: ResolvedPayloadQueries<TQueries>['errors'] = {}

  results.forEach(([key, result]) => {
    data[key] = result.data as ResolvedPayloadQueries<TQueries>['data'][typeof key]

    if (result.error) {
      errors[key] = result.error
    }
  })

  return { data, errors }
}
