import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import child_process from 'child_process'
import { env } from 'process'
import Press from "vite-plugin-press"
import Pages from 'vite-plugin-pages'
import svgr from 'vite-plugin-svgr'
import remarkFrontmatter from 'remark-frontmatter' // YAML and such.
import remarkGfm from 'remark-gfm' // Tables, footnotes, strikethrough, task lists, literal URLs.
import remarkPrism from 'remark-prism'
import remarkParse from "remark-parse"
import rehypeStringify from 'rehype-stringify'
import remarkDirective from 'remark-directive'
import { visit } from 'unist-util-visit'

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg!.groups!.value : "myapp.client";

if (!certificateName) {
    console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
    process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:5001';
const baseUrl = process.env.NODE_ENV === 'development'
    ? "https://locahost:5173"
    : process.env.DEPLOY_HOST ? `https://${process.env.DEPLOY_HOST}` : undefined

// https://vitejs.dev/config/
export default defineConfig(async () => {
    const mdx = await import('@mdx-js/rollup')

    // Convert :::component{.cls}::: Markdown Containers to <component className="cls" />
    function remarkContainers() {
        return function (tree:any) {
            let prevType = ''
            visit(tree, (node): any => {
                const type = node.type
                const data = node.data || (node.data = {})
                // match :::include <file>::: unless within :::pre container block
                if (node.children && node.children[0]?.value?.startsWith(':::include ') && prevType !== 'containerDirective') {
                    const match = node.children[0]?.value.match(/include\s+([^:]+)\s*/)
                    if (match && match[1]) {
                        data.hName = 'include'
                        data.hProperties = Object.assign({}, data.hProperties, { src: match[1] })
                        data.hChildren = []
                    }
                } else if (type === 'textDirective' || type === 'leafDirective' || type === 'containerDirective') {
                    data.hName = node.name
                    data.hProperties = Object.assign({}, data.hProperties, { className: node.attributes?.class })
                }
                prevType = node.type
                return node
            })
        }
    }
    
    console.log('vite.config', baseUrl, target, { posts: fs.existsSync('./src/_posts') })

    return {
        define: { API_URL: `"${target}"` },
        plugins: [
            svgr(),
            mdx.default({
                // See https://mdxjs.com/advanced/plugins
                remarkPlugins: [
                    remarkFrontmatter,
                    remarkDirective,
                    remarkGfm,
                    remarkParse,
                    remarkPrism as any,
                    remarkContainers,
                ],
                rehypePlugins: [
                    rehypeStringify,
                ],
            }),
            Pages({
                extensions: ['tsx', 'mdx']
            }),
            react(),
            Press({
                baseUrl,
                //Uncomment to generate metadata *.json 
                //metadataPath: './public/api',
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            }
        },
        server: {
            proxy: {
                '^/api': {
                    target,
                    secure: false
                }
            },
            port: 5173,
            https: {
                key: fs.readFileSync(keyFilePath),
                cert: fs.readFileSync(certFilePath),
            }
        }
    }
})
