import Page from "@/components/LayoutPage"
import { useSearchParams } from "react-router-dom"

export default () => {
    const [query, _] = useSearchParams()
    const confirmLink = query.get('confirmLink')

    return (<Page title="Signup confirmation" className="max-w-lg">
        <div className="mt-8 mb-20">
            {!confirmLink ? null :
                <p className="my-4">
                    Normally this would be emailed:
                    <a className="pl-2 font-semibold" id="confirm-link" href={confirmLink}>
                        Click here to confirm your account
                    </a>
                </p>}
            <p className="my-4">Please check your email to confirm your account.</p>
        </div>
    </Page>)
}
