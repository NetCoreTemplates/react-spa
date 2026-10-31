/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-press/client" />

declare module '*.mdx' {
    // oxlint-disable-next-line typescript/no-explicit-any
    let MDXComponent: (props: any) => JSX.Element

    export default MDXComponent
}
