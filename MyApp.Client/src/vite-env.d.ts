/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-press/client" />

declare module '*.mdx' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let MDXComponent: (props: any) => JSX.Element

    export default MDXComponent
}
