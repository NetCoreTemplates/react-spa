import Nav from "./Nav"
import Footer from "./Footer"
import Meta from "./Meta"
import { HelmetProvider, Helmet } from "react-helmet-async"

type Props = {
    title?: string
    children: React.ReactNode
}

const Layout = ({title, children}: Props) => {
    return (
        <>
            {!title ? null : <HelmetProvider>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
            </HelmetProvider>}
            <Meta/>
            <Nav/>
            <div className="min-h-screen">
                <main className="flex justify-center">
                    <div className="mt-8 mb-20 mx-auto px-5">
                        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">{title}</h1>
                        <article className="prose lg:prose-xl mb-32">
                            {children}
                        </article>
                    </div>
                </main>
            </div>
            <Footer/>
        </>
    )
}
export default Layout
