import type {AuthenticateResponse, MetadataOperationType} from "./types"
import { useState, useMemo } from 'react'
//import { Sole } from "./config"
import { sanitize } from "@servicestack/client"

export const [user, setUser] = useState<AuthenticateResponse|null>(null)

/** Check if the current user is Authenticated in a reactive Ref<boolean> */
const isAuthenticated = useMemo(() => user != null, [user])

/** Set global configuration */
export const [config, setConfig] = useState<UiConfig>({
    redirectSignIn: '/signin',
    redirectSignOut: '/auth/logout',
    navigate: url => location.href = url,
    assetsPathResolver: src => src,
    fallbackPathResolver: src => src,
    tableIcon: { svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><g fill='none' stroke='currentColor' stroke-width='1.5'><path d='M5 12v6s0 3 7 3s7-3 7-3v-6'/><path d='M5 6v6s0 3 7 3s7-3 7-3V6'/><path d='M12 3c7 0 7 3 7 3s0 3-7 3s-7-3-7-3s0-3 7-3Z'/></g></svg>` },
})

export class Interceptors {
    static instance:Interceptors = new Interceptors()
    
    callbacks:{ [key:string]: (key:string, value:any) => void} = {}

    public register(key:string, callback:(key:string, value:any) => void) {
        this.callbacks[key] = callback
    }
    public has(key:string) { return !!this.callbacks[key] }

    public invoke(key:string, value:any) {
        const cb = this.callbacks[key]
        if (typeof cb == 'function') {
            cb(key, value)
        }
    }
}
export interface ImageInfo {
    svg?: string;
    uri?: string;
    alt?: string;
    cls?: string;
}
export interface UiConfig {
    redirectSignIn?: string
    redirectSignOut?: string
    navigate?: (url:string) => void
    assetsPathResolver?: (src:string) => string
    fallbackPathResolver?: (src:string) => string
    storage?:Storage
    tableIcon?:ImageInfo
    scopeWhitelist?: {[k:string]:Function}
}

/** Resolve Absolute URL to use for relative paths */
export function assetsPathResolver(src?:string) {
    return src && config.assetsPathResolver
        ? config.assetsPathResolver(src)
        : src
}

/** Resolve fallback URL to use if primary URL fails */
export function fallbackPathResolver(src?:string) {
    return src && config.fallbackPathResolver
        ? config.fallbackPathResolver(src)
        : src
}

export function registerInterceptor(key:string, callback:(key:string, value:any) => void) {
    Interceptors.instance.register(key, callback)
}

/** Manage Global Configuration for Component Library */
export function useConfig() {
    /** Resolve configuration in a reactive Ref<UiConfig> */
    return {
        config, setConfig, 
        assetsPathResolver, fallbackPathResolver,
        registerInterceptor,
    }
}


function toAuth(auth?:AuthenticateResponse) {
    return auth && (auth as any).SessionId
        ? sanitize(auth)
        : auth
}

/** Sign In the currently Authenticated User */
function signIn(user:AuthenticateResponse) {
    setUser(toAuth(user)!)
    //Sole.events.publish('signIn', user)
}

/** Sign Out currently Authenticated User */
function signOut() {
    setUser(null)
    //Sole.events.publish('signOut', null)
}

/** @returns {string[]} */
const getRoles = (user:any) => user?.roles || []
/** @returns {string[]} */
const getPermissions = (user:any) => user?.permissions || []

/** Check if the Authenticated User has a specific role */
function hasRole(role:string) {
    return getRoles(user).indexOf(role) >= 0
}

/** Check if the Authenticated User has a specific permission */
function hasPermission(permission:string) {
    return getPermissions(user).indexOf(permission) >= 0
}

/** Check if the Authenticated User has the Admin role */
function isAdmin() {
    return hasRole('Admin')
}

/** Check if Auth Session has access to API */
export function canAccess(op?:MetadataOperationType|null) {
    if (!op) return false
    if (!op.requiresAuth)
        return true
    const auth = user
    if (!auth)
        return false
    if (isAdmin())
        return true
    let [roles, permissions] = [getRoles(auth), getPermissions(auth)]
    let [requiredRoles, requiredPermissions, requiresAnyRole, requiresAnyPermission] = [
        op.requiredRoles || [], op.requiredPermissions || [], op.requiresAnyRole || [], op.requiresAnyPermission || []]
    if (!requiredRoles.every((role:string) => roles.indexOf(role) >= 0))
        return false
    if (requiresAnyRole.length > 0 && !requiresAnyRole.some((role:string) => roles.indexOf(role) >= 0))
        return false
    if (!requiredPermissions.every((perm:string) => permissions.indexOf(perm) >= 0))
        return false
    if (requiresAnyPermission.length > 0 && !requiresAnyPermission.every((perm:string) => permissions.indexOf(perm) >= 0))
        return false
    return true
}

/** Return error message if Authenticated User cannot access API */
export function invalidAccessMessage(op:MetadataOperationType) {
    if (!op || !op.requiresAuth) return null
    const auth = user
    if (!auth) {
        return `<b>${op.request.name}</b> requires Authentication`
    }
    if (isAdmin())
        return null;
    let [roles, permissions] = [getRoles(auth), getPermissions(auth)]
    let [requiredRoles, requiredPermissions, requiresAnyRole, requiresAnyPermission] = [
        op.requiredRoles || [], op.requiredPermissions || [], op.requiresAnyRole || [], op.requiresAnyPermission || []]
    let missingRoles = requiredRoles.filter((x:string) => roles.indexOf(x) < 0)
    if (missingRoles.length > 0)
        return `Requires ${missingRoles.map((x:string) => '<b>' + x + '</b>').join(', ')} Role` + (missingRoles.length > 1 ? 's' : '')
    let missingPerms = requiredPermissions.filter((x:string) => permissions.indexOf(x) < 0)
    if (missingPerms.length > 0)
        return `Requires ${missingPerms.map((x:string) => '<b>' + x + '</b>').join(', ')} Permission` + (missingPerms.length > 1 ? 's' : '')
    if (requiresAnyRole.length > 0 && !requiresAnyRole.some((role:string) => roles.indexOf(role) >= 0))
        return `Requires any ${requiresAnyRole.filter((x:string) => roles.indexOf(x) < 0)
            .map(x => '<b>' + x + '</b>').join(', ')} Role` + (missingRoles.length > 1 ? 's' : '')
    if (requiresAnyPermission.length > 0 && !requiresAnyPermission.every((perm:string) => permissions.indexOf(perm) >= 0))
        return `Requires any ${requiresAnyPermission.filter((x:string) => permissions.indexOf(x) < 0)
            .map(x => '<b>' + x + '</b>').join(', ')} Permission` + (missingPerms.length > 1 ? 's' : '')
    return null
}

/** Access the currently Authenticated User info in a reactive Ref<AuthenticateResponse> */
export function useAuth() {

    //const user = computed(() => Sole.user.value || null)

    return { signIn, signOut, user, toAuth, isAuthenticated, hasRole, hasPermission, isAdmin, canAccess, invalidAccessMessage }
}
