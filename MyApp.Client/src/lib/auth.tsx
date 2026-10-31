import React, { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth, Loading } from "@servicestack/react"
import { client, isServerRoute, Routes } from "./gateway"
import { Authenticate } from "@/lib/dtos"

export const Redirecting = () => {
  return <Loading className="py-2 pl-4">redirecting ...</Loading>
}

type ValidateAuthProps = {
  role?: string
  permission?: string
  redirectTo?: string
}
export function ValidateAuth<TOriginalProps extends object>(Component:React.FC<TOriginalProps>, validateProps? :ValidateAuthProps) {
    let { role, permission, redirectTo } = validateProps ?? {}
    const ValidatedComponent: React.FC<TOriginalProps> = (props) => {
        const navigate = useNavigate()
        const location = useLocation()
        const authProps = useAuth()
        const { user, isAuthenticated, hasRole } = authProps

        redirectTo ??= location.pathname

        const shouldRedirect = () => !isAuthenticated
            ? Routes.signin(redirectTo)
            : role && !hasRole(role)
                ? Routes.forbidden()
                : permission && !hasRole(permission)
                    ? Routes.forbidden()
                    : null;

        useEffect(() => {
            const goTo = shouldRedirect()
            if (goTo) {
                if (isServerRoute(goTo)) {
                    window.location.href = goTo
                } else {
                    navigate(goTo, { replace: true })
                }
            }
        }, [user])

        if (shouldRedirect()) {
            return <Redirecting />
        }

        return <Component {...props} />
    }

    return ValidatedComponent
}

// appAuth is a hook, but keeps its name for compatibility with the other templates
export function appAuth() {
    // oxlint-disable-next-line react/rules-of-hooks
    const navigate = useNavigate()
    // oxlint-disable-next-line react/rules-of-hooks
    const authState = useAuth()
    async function revalidate() {
        try {
            const response = await client.post(new Authenticate())
            authState.signIn(response)
        } catch {
            authState.signOut()
        }
    }
    async function signOut(redirectTo?:string) {
        await client.post(new Authenticate({ provider: 'logout' }))
        authState.signOut()
        if (redirectTo) {
            navigate(redirectTo)
        }
    }
    return { ...authState, revalidate, signOut }
}
