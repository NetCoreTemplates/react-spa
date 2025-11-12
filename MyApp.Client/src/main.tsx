import './assets/styles/index.css'
import './assets/styles/main.css'
import 'react/jsx-runtime'
import Layout from '@/components/Layout'
import { Loading, ClientContext, setLinkComponent } from "@servicestack/react"

import { ThemeProvider } from "@/components/theme-provider"
import { StrictMode, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, useRoutes, useLocation, Link } from 'react-router-dom'

import routes from '~react-pages'

import press from "virtual:press"
import { PressContext } from './contexts'
import { client, init } from "@/gateway"

// Configure the library to use React Router's Link component
setLinkComponent(Link)
init()

function App() {
    return (
        <Suspense fallback={<Layout><Loading className='p-4'></Loading></Layout>}>
            <ThemeProvider defaultTheme="light" storageKey="color-scheme">
                <PressContext.Provider value={press}>
                    <ClientContext.Provider value={client}>
                        {useRoutes(routes)}
                    </ClientContext.Provider>
                </PressContext.Provider>
            </ThemeProvider>
        </Suspense>
    )
}

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

const app = createRoot(document.getElementById('root')!)

app.render(
    <StrictMode>
        <Router>
            <ScrollToTop />
            <App/>
        </Router>
    </StrictMode>,
)