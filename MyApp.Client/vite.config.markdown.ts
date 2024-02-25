import { h } from 'hastscript'
import { visit } from 'unist-util-visit'

const FencedComponents = ['files']

// Convert ```component``` to <component body={children} />
export function remarkFencedCode(options: { components?:string[] } = {}) {
    return function (tree: any) {
        visit(tree, (node): any => {
            const allComponents = [...(options.components || []), ...FencedComponents]
            const type = node.type
            const data = node.data || (node.data = {})
            if (type === 'code' && allComponents.includes(node.lang)) {
                node.type = 'paragraph'
                data.hName = node.lang
                data.hProperties = Object.assign({}, data.hProperties, { className: node.attributes?.class, body:node.value })
            }
            return node
        })
    }
}

// Convert :::component{.cls}::: Markdown Containers to <component className="cls" />
export function remarkContainers() {
    return function (tree: any) {
        let i = 0
        let prevType = ''
        visit(tree, (node): any => {
            const type = node.type
            const data = node.data || (node.data = {})
            const firstChild = node.children && node.children[0]
            const line = firstChild?.value
            if (type === 'textDirective' || type === 'leafDirective' || type === 'containerDirective') {
                data.hName = node.name
                data.hProperties = Object.assign({}, data.hProperties, { className: node.attributes?.class })
            } else if (line?.startsWith(':::') && prevType !== 'containerDirective' && node.tagName != 'code') {
                // match :::include <file>::: unless within :::pre container or code block
                const m = line.match(/:::([^\s]+)\s+([^:]+)\s*/)
                if (m) {
                    const tag = m[1]
                    const tagBody = m[2]?.split(/\n/)
                    const arg = tagBody[0]?.trim() ?? ''
                    const body = tagBody[1]?.trim() ?? ''
                    data.hName = tag
                    const argName = tag === 'include' ? 'src' : 'arg'
                    data.hProperties = Object.assign({}, data.hProperties, { [argName]:arg, className: node.attributes?.class })
                    if (body) {
                        data.hChildren = [h('p',body)]
                    }
                }
            }
            prevType = node.type
            return node
        })
    }
}
export default remarkContainers