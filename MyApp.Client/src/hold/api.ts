import { JsonServiceClient, combinePaths } from "@servicestack/client"
import { Authenticate } from "./dtos"

export const client = new JsonServiceClient()

export function useApp() {

    async function load (force?:boolean) {
    }

    return {
        load,
        client,
    }
}

export async function checkAuth() {
    try {
        return await client.post(new Authenticate())
    } catch (e) {
        return undefined
    }
}

export async function logout() {
    await client.post(new Authenticate({ provider: 'logout' }))
    const { signOut } = useAuth()
    signOut()
}

declare var API_URL:string //defined in vite.config.ts

export function apiUrl(path:string) {
    return combinePaths(API_URL,path)
}
