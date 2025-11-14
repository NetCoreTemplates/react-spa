import { useState, useEffect } from "react"
import { TextInput, useClient } from "@servicestack/react"
import { Hello } from "@/dtos"

type Props = { value: string }
export default ({ value }:Props) => {
    const [name, setName] = useState(value)
    const [result, setResult] = useState('')
    
    const client = useClient()
    useEffect(() => {
        (async () => {
            let api = await client.api(new Hello({ name }))
            if (api.response) {
                setResult(api.response.result)
            }
        })()
    }, [name])

    return (<div className="my-8 max-w-fit mx-auto">
        <TextInput id="name" value={name} onChange={setName} />
        <b className="my-2 block text-center text-lg">{result}</b>
    </div>)
}
