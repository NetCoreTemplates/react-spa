import { useState } from "react"
import LayoutPage from "@/components/LayoutPage"
import SrcPage from "@/components/SrcPage"
import { PrimaryButton } from "@servicestack/react"

export default () => {
    const [count, setCount] = useState(0)
    const title = `Counter`

    return (<LayoutPage title={title}>
        <p className="my-4">Current count: {count}</p>

        <PrimaryButton onClick={() => setCount(count + 1)}>Click me</PrimaryButton>

        <div className="mt-8 flex justify-center gap-x-4">
            <SrcPage path="counter.tsx"/>
        </div>
    </LayoutPage>)
}
