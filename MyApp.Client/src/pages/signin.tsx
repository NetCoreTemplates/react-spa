import { serializeToObject } from "@servicestack/client"
import { SyntheticEvent, useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"

import Page from "@/components/LayoutPage"
import { getRedirect } from "@/gateway"
import { ErrorSummary, TextInput, PrimaryButton, SecondaryButton, useClient, ApiStateContext } from "@servicestack/react"
import { Authenticate } from "@/dtos"
import { appAuth, Redirecting } from "@/auth.tsx"
import { useSearchParams, Link } from "react-router-dom"

export default () => {

    const client = useClient()
    const [username, setUsername] = useState<string|number>()
    const [password, setPassword] = useState<string|number>()

    const setUser = (email: string) => {
        setUsername(email)
        setPassword('p@55wOrd')
    }
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const { user, revalidate } = appAuth()
    useEffect(() => {
        if (user) navigate(getRedirect(searchParams) || "/", {replace: true})
    }, [user]);
    if (user) return <Redirecting/>

    const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        const {userName, password, rememberMe} = serializeToObject(e.currentTarget);
        const api = await client.api(new Authenticate({provider: 'credentials', userName, password, rememberMe}))
        if (api.succeeded)
            await revalidate()
    }

    return (<Page title="Use a local account to log in." className="max-w-lg">
        <ApiStateContext.Provider value={client}>
            <section className="mt-4 sm:shadow overflow-hidden sm:rounded-md">
                <form onSubmit={onSubmit}>
                    <div className="shadow overflow-hidden sm:rounded-md">
                        <ErrorSummary except="userName,password,rememberMe"/>
                        <div className="px-4 py-5 bg-white dark:bg-black space-y-6 sm:p-6">
                            <div className="flex flex-col gap-y-4">
                                <TextInput id="userName" help="Email you signed up with" autoComplete="email"
                                           value={username} onChange={setUsername}/>
                                <TextInput id="password" type="password" help="6 characters or more"
                                           autoComplete="current-password"
                                           value={password} onChange={setPassword}/>
                            </div>

                            <div>
                                <PrimaryButton>Log in</PrimaryButton>
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
        </ApiStateContext.Provider>
        <div className="mt-8">
            <h3 className="xs:block mr-4 leading-8 text-gray-500">Quick Links</h3>
            <div className="flex flex-wrap max-w-lg gap-2">
                <SecondaryButton onClick={() => setUser('admin@email.com')}>
                    admin@email.com
                </SecondaryButton>
                <SecondaryButton onClick={() => setUser('manager@email.com')}>
                    manager@email.com
                </SecondaryButton>
                <SecondaryButton onClick={() => setUser('employee@email.com')}>
                    employee@email.com
                </SecondaryButton>
                <SecondaryButton onClick={() => setUser('new@user.com')}>
                    new@user.com
                </SecondaryButton>
            </div>
        </div>
    </Page>)
}
