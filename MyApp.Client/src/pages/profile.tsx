import { SecondaryButton } from "@servicestack/react"
import { Icon } from "@iconify/react"
import Page from "@/components/LayoutPage"
import { ValidateAuth, appAuth } from "@/auth.tsx"

function Profile () {
    const { user, signOut } = appAuth()
    return (<Page title={user.displayName + ' Profile'}>
        <div className="flex flex-col items-center justify-center">
            {user.profileUrl
                ? <img src={user.profileUrl} className="w-36 h-36 rounded-full" alt="Profile"/>
                : <Icon icon="mdi:account-circle" className="w-36 h-36 text-gray-700" />}
            <div className="my-2 prose">
                <div>{user.displayName}</div>
                <div>{user.userName}</div>
            </div>
            <div className="mt-2">
                {(user.roles || []).map(role => 
                <span key={role} className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-indigo-100 text-indigo-800">{role}</span>)}
            </div>
            <SecondaryButton className="mt-8" onClick={() => signOut()}>Sign Out</SecondaryButton>
        </div>
    </Page>)
}
export default ValidateAuth(Profile)
