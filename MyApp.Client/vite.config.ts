import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

import Press from "vite-plugin-press"
import Pages from 'vite-plugin-pages'
import svgr from 'vite-plugin-svgr'
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from 'remark-frontmatter' // YAML and such.
import remarkGfm from 'remark-gfm' // Tables, footnotes, strikethrough, task lists, literal URLs.
import remarkPrism from 'remark-prism'
import remarkParse from "remark-parse"
import rehypeStringify from 'rehype-stringify'
import remarkDirective from 'remark-directive'
import rehypeRaw from 'rehype-raw'
import { remarkContainers, remarkFencedCode } from './vite.config.markdown'

const target = process.env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${process.env.ASPNETCORE_HTTPS_PORT}` :
    process.env.ASPNETCORE_URLS ? process.env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:5001';

const isProd = process.env.NODE_ENV === 'production'
const buildLocal = process.env.MODE === 'local'

// Define DEPLOY_API first
const DEPLOY_API = process.env.KAMAL_DEPLOY_HOST 
    ? `https://${process.env.KAMAL_DEPLOY_HOST}` 
    : target

// Now use it for API_URL
const API_URL = isProd ? DEPLOY_API : (buildLocal ? '' : target)

export default defineConfig({
    define: { apiBaseUrl: `"${API_URL}"` },
    plugins: [
        svgr(),
        mdx({
            // See https://mdxjs.com/advanced/plugins
            remarkPlugins: [
                remarkFrontmatter,
                remarkFencedCode,
                remarkDirective,
                remarkGfm,
                remarkParse,
                remarkPrism as any,
                remarkContainers,
            ],
            rehypePlugins: [
                [rehypeRaw, {passThrough:['mdxjsEsm','mdxFlowExpression','mdxJsxFlowElement','mdxJsxTextElement','mdxTextExpression']}],
                rehypeStringify,
            ],
        }),
        Pages({
            extensions: ['tsx', 'mdx']
        }),
        react(),
        tailwindcss(),
        Press({
            baseUrl: target,
            //Uncomment to generate metadata *.json
            //metadataPath: './public/api',
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
    build: {
        target: 'baseline-widely-available',
    },
    server: {
        host: true, // Listen on all interfaces (both IPv4 and IPv6)
        open: false,
    }
})
