import React, { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import useSWR, { KeyedMutator, useSWRConfig } from "swr"
import { client, Routes } from "./gateway"
import { Authenticate, AuthenticateResponse } from "@/dtos"
import { Loading } from "@/components/Form"

const KEY = "/api/Authenticate"

export const Redirecting = () => {
  return <Loading className="py-2 pl-4" text="redirecting ..." />
}

type ValidateAuthProps = {
  role?: string
  permission?: string
  redirectTo?: string
}
export function ValidateAuth<TOriginalProps extends {}>(Component:React.FC<TOriginalProps>, validateProps? :ValidateAuthProps) {
  let { role, permission, redirectTo } = validateProps ?? {}
  const compWithProps: React.FC<TOriginalProps & AuthenticatedContext> = (props) => {
    const navigate = useNavigate()
    const authProps = useAuth()
    const { auth, signedIn, hasRole } = authProps
    const location = useLocation()
    useEffect(() => {
      const goTo = shouldRedirect()
      if (goTo) {
        navigate(goTo, { replace:true })
      }
    }, [auth])

    redirectTo ??= location.pathname

    const shouldRedirect = () => !signedIn
        ? Routes.signin(redirectTo)
        : role && !hasRole(role)
            ? Routes.forbidden()
            : permission && !hasRole(permission)
                ? Routes.forbidden()
                : null;

    if (shouldRedirect()) {
      return <Redirecting />
    }

    return <Component {...authProps} {...props} />
  }

  return compWithProps
}

export type AuthContext = {
  signedIn: boolean
  attrs: string[]
  loading: boolean
  signout: (redirectTo?:string) => void
  revalidate:KeyedMutator<AuthenticateResponse>
  hasRole:(role:string) => boolean
  hasPermission:(permission:string) => boolean
}
export type OptionalAuthContext = AuthContext & {
  auth: AuthenticateResponse|undefined
}
export type AuthenticatedContext = AuthContext & {
  auth: AuthenticateResponse
}

type Props = {}
export function useAuth({}: Props = {}) : OptionalAuthContext {
  const { data:auth, mutate:revalidate, error } = useSWR(KEY, _ =>
      client.post(new Authenticate()))
  const { cache } = useSWRConfig()
  const loading = error === undefined && auth === undefined
  const signedIn = error === undefined && auth !== undefined
  const navigate = useNavigate()

  let attrs:string[] = !loading && auth ? [
    'auth',
    ...(auth?.roles || []).map(role => `role:${role}`),
    ...(auth?.permissions || []).map(perm => `perm:${perm}`),
  ] : []

  async function signout(redirectTo?:string) {
    await client.post(new Authenticate({ provider: 'logout' }));
    (cache as any).delete(KEY);
    await revalidate()
    if (redirectTo) {
      navigate(redirectTo)
    }
  }

  const isAdmin = () => (auth?.roles || []).indexOf('Admin') >= 0
  const hasRole = (role:string) => (auth?.roles || []).indexOf(role) >= 0 || isAdmin()
  const hasPermission = (permission:string) => (auth?.permissions || []).indexOf(permission) >= 0 || isAdmin()

  return { auth, signedIn, attrs, loading, signout, revalidate, hasRole, hasPermission }
}
