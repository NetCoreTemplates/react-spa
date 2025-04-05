import { useState } from "react"
import LayoutPage from "@/components/LayoutPage"
import { Button } from "@/components/ui/button"
import SrcPage from "@/components/SrcPage"

export default (): React.JSX.Element => {
    const [count, setCount] = useState(0)
    const title = `Counter`

    return (<LayoutPage title={title}>
        <p className="my-4">Current count: {count}</p>

        <Button onClick={() => setCount(count + 1)}>Click me</Button>

        <div className="mt-8 flex justify-center gap-x-4">
            <SrcPage path="counter.tsx"/>
        </div>
    </LayoutPage>)
}
