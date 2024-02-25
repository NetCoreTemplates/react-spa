import { useState } from "react"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import SrcPage from "@/components/SrcPage"

export default (): JSX.Element => {
    const [count, setCount] = useState(0)
    const title = `Counter`

    return (<Layout title={title}>
            <div className="mt-8 mb-20 mx-auto max-w-fit">
                <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">{title}</h1>

                <p className="my-4">Current count: {count}</p>

                <Button onClick={() => setCount(count + 1)}>Click me</Button>

                <div className="mt-8 flex justify-center gap-x-4">
                    <SrcPage path="counter.tsx" />
                </div>
            </div>
        </Layout>)
}
