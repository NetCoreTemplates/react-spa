import { useState } from 'react'

export default () => {
    let [count, setCount] = useState(1)
    return <b onClick={() => setCount(count+=1)}>Counter {count}</b>
}
