import { useMetadata, authContext } from "@servicestack/react"
import { appendQueryString, nameOf, IReturn, JsonServiceClient, combinePaths } from "@servicestack/client"
import useSWR from "swr"
import { Authenticate } from "@/dtos.ts"

export const Routes = {
    signin: (redirectTo?: string) => redirectTo ? `/signin?redirect=${redirectTo}` : `/signin`,
    forbidden: () => '/forbidden',
}

declare var API_URL: string //defined in vite.config.ts
export const BaseUrl = API_URL

export function apiUrl(path: string) {
    return combinePaths(API_URL, path)
}

export const client = new JsonServiceClient()
export const metadata = useMetadata(client)

// Load Metadata & Auth State on Startup
export async function init() {
    const authCtx = authContext()
    return await Promise.all([
        metadata.loadMetadata(),
        client.post(new Authenticate())
            .then(r => {
                authCtx.signIn(r)
            }).catch(() => {
            authCtx.signOut()
        })
    ])
}

export function getRedirect(searchParams:URLSearchParams) {
    const redirect = searchParams.get('redirect')
    return redirect && Array.isArray(redirect)
        ? redirect[0]
        : redirect
}

// Typed Stale While Revalidate client
class SwrClient {
    client: JsonServiceClient

    constructor(client: JsonServiceClient) {
        this.client = client
    }

    get<T>(fn: () => IReturn<T> | string) {
        return useSWR(() => {
            let request = fn()
            return appendQueryString(`SwrClient:${nameOf(request)}`, request)
        }, _ => this.client.get(fn()))
    }
}

export const swrClient = new SwrClient(client)