import { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from "react"
import { serializeToObject, leftPart, rightPart, toPascalCase } from "@servicestack/client"
import { useNavigate } from "react-router-dom"

import Page from "@/components/LayoutPage"
import { FormLoading, ErrorSummary, TextInput, Checkbox, getRedirect, ApiContext } from "@/components/Form"
import { Button } from "@/components/ui/button"
import { useClient } from "@/gateway"
import { Register, RegisterResponse } from "@/dtos"
import { useAuth, Redirecting } from "@/useAuth"
import { useSearchParams } from "react-router-dom"

export default () => {

    const client = useClient()
    const [displayName, setDisplayName] = useState<string>()
    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()
    const navigate = useNavigate()

    const setUser = (email: string) => {
        let first = leftPart(email, '@');
        let last = rightPart(leftPart(email, '.'), '@')
        setDisplayName(toPascalCase(first) + ' ' + toPascalCase(last))
        setUsername(email)
        setPassword('p@55wOrd')
    }

    const [searchParams] = useSearchParams()
    const {signedIn, revalidate} = useAuth()
    useEffect(() => {
        if (signedIn) navigate(getRedirect(searchParams) || "/")
    }, [signedIn])
    if (signedIn) return <Redirecting/>

    const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        const {displayName, userName, password, confirmPassword, autoLogin} = serializeToObject(e.currentTarget);
        if (password !== confirmPassword) {
            client.setError({fieldName: 'confirmPassword', message: 'Passwords do not match'})
            return
        }

        const api = await client.api(new Register({displayName, email: userName, password, confirmPassword, autoLogin}))
        if (api.succeeded) {
            await revalidate()
            const redirectUrl = (api.response as RegisterResponse).redirectUrl
            if (redirectUrl) {
                location.href = redirectUrl
            } else {
                navigate("/signin")
            }

        }
    }

    const change = (setField: (Dispatch<SetStateAction<string | undefined>>)) =>
        (e: ChangeEvent<HTMLInputElement>) => setField(e.target.value)

    return (<Page title="Sign Up" className="max-w-lg">
        <ApiContext.Provider value={client}>
            <section className="mt-4 sm:shadow overflow-hidden sm:rounded-md">
                <form onSubmit={onSubmit} className="max-w-prose">
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <ErrorSummary except="displayName,userName,password,confirmPassword"/>
                        <div className="px-4 py-5 bg-white dark:bg-black space-y-6 sm:p-6">
                            <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                                Create a new account.
                            </h3>
                            <div className="flex flex-col gap-y-4">
                                <TextInput id="displayName" help="Your first and last name" autoComplete="name"
                                           value={displayName} onChange={change(setDisplayName)}/>
                                <TextInput id="userName" autoComplete="email"
                                           value={username} onChange={change(setUsername)}/>
                                <TextInput id="password" type="password" help="6 characters or more"
                                           autoComplete="new-password"
                                           value={password} onChange={change(setPassword)}/>
                                <TextInput id="confirmPassword" type="password" defaultValue={password}/>
                                <Checkbox id="autoLogin"/>
                            </div>
                        </div>
                        <div className="pt-5 px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
                            <div className="flex justify-end">
                                <FormLoading className="flex-1"/>
                                <Button className="ml-3">Sign Up</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </ApiContext.Provider>

        <div className="flex mt-8 ml-8">
            <h3 className="mr-4 leading-8 text-gray-500">Quick Links</h3>
            <div className="flex flex-wrap max-w-lg gap-2">
                <Button variant="outline" onClick={() => setUser('new@user.com')}>
                    new@user.com
                </Button>
            </div>
        </div>
    </Page>)
}
