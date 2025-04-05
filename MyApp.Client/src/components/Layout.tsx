import Header from "./Header"
import Footer from "./Footer"
import Meta from "./Meta"

type Props = {
    title?: string
    children: React.ReactNode
}

const Layout = ({title, children}: Props) => {
    return (
        <>
            {!title ? null : <title>{title}</title>}
            <Meta/>
            <Header/>
            <div className="min-h-screen">
                <main role="main">
                    {children}
                </main>
            </div>
            <Footer/>
        </>
    )
}

export default Layout
