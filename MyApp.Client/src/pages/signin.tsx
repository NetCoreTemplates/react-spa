import { serializeToObject } from "@servicestack/client"
import { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import Page from "@/components/LayoutPage"
import { ApiContext, ErrorSummary, TextInput, Checkbox, getRedirect } from "@/components/Form"
import { useClient } from "@/gateway"
import { Authenticate } from "@/dtos"
import { useAuth, Redirecting } from "@/useAuth"
import { Button } from "@/components/ui/button"
import { useSearchParams, Link } from "react-router-dom"

export default () => {

    const client = useClient()
    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()

    const setUser = (email: string) => {
        setUsername(email)
        setPassword('p@55wOrd')
    }
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const {signedIn, revalidate} = useAuth();
    useEffect(() => {
        if (signedIn) navigate(getRedirect(searchParams) || "/", {replace: true})
    }, [signedIn]);
    if (signedIn) return <Redirecting/>

    const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        const {userName, password, rememberMe} = serializeToObject(e.currentTarget);
        const api = await client.api(new Authenticate({provider: 'credentials', userName, password, rememberMe}))
        if (api.succeeded)
            await revalidate()
    }

    const change = (setField: (Dispatch<SetStateAction<string | undefined>>)) =>
        (e: ChangeEvent<HTMLInputElement>) => setField(e.target.value)

    return (<Page title="Use a local account to log in." className="max-w-lg">
        <ApiContext.Provider value={client}>
            <section className="mt-4 sm:shadow overflow-hidden sm:rounded-md">
                <form onSubmit={onSubmit}>
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <ErrorSummary except="userName,password,rememberMe"/>
                        <div className="px-4 py-5 bg-white dark:bg-black space-y-6 sm:p-6">
                            <div className="flex flex-col gap-y-4">
                                <TextInput id="userName" help="Email you signed up with" autoComplete="email"
                                           value={username} onChange={change(setUsername)}/>
                                <TextInput id="password" type="password" help="6 characters or more"
                                           autoComplete="current-password"
                                           value={password} onChange={change(setPassword)}/>
                                <Checkbox id="rememberMe"/>
                            </div>

                            <div>
                                <Button id="login-submit" type="submit">Log in</Button>
                            </div>

                            <div className="mt-8 text-sm">
                                <p className="mb-3">
                                    <Link className="font-semibold" to="/signup">Register as a new user</Link>
                                </p>
                            </div>
                        </div>

                    </div>
                </form>
            </section>
        </ApiContext.Provider>
        <div className="mt-8">
            <h3 className="xs:block mr-4 leading-8 text-gray-500">Quick Links</h3>
            <div className="flex flex-wrap max-w-lg gap-2">
                <Button variant="outline" type="button" onClick={_ => setUser('admin@email.com')}>
                    admin@email.com
                </Button>
                <Button variant="outline" type="button" onClick={_ => setUser('manager@email.com')}>
                    manager@email.com
                </Button>
                <Button variant="outline" type="button" onClick={_ => setUser('employee@email.com')}>
                    employee@email.com
                </Button>
                <Button variant="outline" type="button" onClick={_ => setUser('new@user.com')}>
                    new@user.com
                </Button>
            </div>
        </div>
    </Page>)
}
