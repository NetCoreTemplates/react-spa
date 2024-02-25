import Header from "./Header"
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
            <Header/>
            <div className="min-h-screen">
                <main role="main">
                    <main>{children}</main>
                </main>
            </div>
            <Footer/>
        </>
    )
}

export default Layout
