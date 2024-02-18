import { HelmetProvider, Helmet } from "react-helmet-async"

export default () => {
  return (
    <HelmetProvider>
    <Helmet>
      <meta
        name="description"
        content={`Vite + React SPA`}
      />
      <meta property="og:image" content="/img/logo.svg" />
    </Helmet>
    </HelmetProvider>
  )
}
