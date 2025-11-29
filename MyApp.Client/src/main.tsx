import '@/styles/index.css'
import '@/styles/main.css'
import 'react/jsx-runtime'
import Layout from '@/components/Layout'
import { Loading, ClientContext, setLinkComponent } from "@servicestack/react"

import { ThemeProvider } from "@/components/theme-provider"
import { forwardRef, StrictMode, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, useRoutes, useLocation, Link, LinkProps } from 'react-router-dom'

import routes from '~react-pages'

import press from "virtual:press"
import { PressContext } from './contexts'
import { client, init, isServerRoute } from "@/lib/gateway"

// Custom Link that forces full page redirect for /Identity paths
const AppLink = forwardRef<HTMLAnchorElement, LinkProps>(({ to, ...props }, ref) => {
  const path = typeof to === 'string' ? to : to.pathname ?? ''
  if (isServerRoute(path)) {
    return <a ref={ref} href={path} {...props} />
  }
  return <Link ref={ref} to={to} {...props} />
})

// Configure the library to use our custom Link component
setLinkComponent(AppLink)
init().then(() => {
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
  createRoot(document.getElementById('root')!).render(
   <StrictMode>
        <Router>
            <ScrollToTop />
            <App/>
        </Router>
    </StrictMode>,
  )
})