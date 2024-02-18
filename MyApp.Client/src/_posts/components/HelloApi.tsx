import { ChangeEvent, useState, useEffect } from "react"
import { JsonServiceClient } from "@servicestack/client"
import { TextInput } from "@/components/Form"
import { Hello } from "@/dtos"

type Props = { value: string }
export default ({ value }:Props) => {
    const [name, setName] = useState(value)
    const [result, setResult] = useState('')
    
    const client = new JsonServiceClient()
    useEffect(() => {
        (async () => {
            let api = await client.api(new Hello({ name }))
            if (api.response) {
                setResult(api.response.result)
            }
        })()
    }, [name])

    return (<div className="my-8 max-w-fit mx-auto">
        <TextInput value={name} onChange={(e:ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
        <b className="my-2 block text-center text-lg">{result}</b>
    </div>)
}
