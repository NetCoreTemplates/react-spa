import { useMetadata, authContext } from "@servicestack/react"
import { appendQueryString, nameOf, IReturn, JsonServiceClient } from "@servicestack/client"
import useSWR from "swr"
import { Authenticate } from "@/lib/dtos"

const serverRoutePaths = [
    '/Identity',
    '/metadata',
    '/api',
    '/ui',
    '/chat',
    '/admin-ui',
    '/swagger',
    '/scalar',
]

export function isServerRoute(path:string) {
    return serverRoutePaths.some(x => path.startsWith(x))
}

export const Routes = {
    signin: (redirectTo?: string) => redirectTo ? `/Identity/Account/Login?ReturnUrl=${redirectTo}` : `/signin`,
    forbidden: () => '/forbidden',
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