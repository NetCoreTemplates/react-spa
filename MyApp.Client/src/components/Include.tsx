import React, { lazy, Suspense } from 'react'
import { PressContext } from "@/contexts"
import { Components } from "@/components/MarkdownComponent"

export default ({ src }:{ src:string }) => {
    const press = React.useContext(PressContext)
    const factory = (press.components as any).includes[src]
    const Component = lazy(factory ? factory : () => Promise.resolve(<></>))
    return factory
        ? <Suspense fallback={<></>}><Component components={Components} /></Suspense>
        : <div className="text-red-500">Include '{src}' not found</div>
}
