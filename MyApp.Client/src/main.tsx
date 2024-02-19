import './assets/styles/index.css'
import './assets/styles/main.css'
import 'react/jsx-runtime'
import Layout from '@/components/Layout'
import { Loading } from '@/components/Form'

import { ThemeProvider } from "@/components/theme-provider"
import { StrictMode, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, useRoutes, useLocation } from 'react-router-dom'

import routes from '~react-pages'

import press from "virtual:press"
import { PressContext } from './contexts'
import { useApp } from "@/gateway";

useApp().load()

function App() {
    return (
        <Suspense fallback={<Layout><Loading className='p-4'></Loading></Layout>}>
            <ThemeProvider defaultTheme="light" storageKey="color-scheme">
                <PressContext.Provider value={press}>
                    {useRoutes(routes)}
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