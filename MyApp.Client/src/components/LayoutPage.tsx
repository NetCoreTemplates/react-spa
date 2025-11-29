import type React from "react"
import Layout from "@/components/Layout"
import ErrorBoundary from "@/components/ErrorBoundary"
import { cn } from "@/lib/utils"

type Props = {
    title: string
    heading?: string
    className?: string
    children: React.ReactNode
}
export default ({ title, heading, className, children }:Props) => {
    return (<Layout title={title}>
        <ErrorBoundary>
            <div className={cn(className ?? "max-w-fit", "mt-8 mb-20 mx-auto")}>
                <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">{heading ?? title}</h1>
                {children}
            </div>
        </ErrorBoundary>
    </Layout>)
}
