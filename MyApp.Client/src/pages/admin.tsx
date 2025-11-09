import { SecondaryButton } from "@servicestack/react"
import { Icon } from "@iconify/react"
import Page from "@/components/LayoutPage"
import { ValidateAuth, appAuth } from "@/auth.tsx"

function Admin () {
    const { user, signOut } = appAuth()
    return (<Page title="Admin Page">
        <div className="flex flex-col items-center justify-center">
            <Icon icon="mdi:shield-account" className="w-36 h-36 text-gray-700" />
            <div>{user!.displayName}</div>
            <div>{user!.userName}</div>
            <div className="mt-2">
                {(user!.roles || []).map(role => 
                <span key={role} className="ml-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium leading-5 bg-indigo-100 text-indigo-800">{role}</span>)}
            </div>
            <SecondaryButton className="mt-8" onClick={signOut}>Sign Out</SecondaryButton>
        </div>
    </Page>)
}
export default ValidateAuth(Admin, { role: "Admin" })
