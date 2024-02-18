import { useContext } from "react"
import { PressContext } from "@/contexts"

type Props = {
    heading: string
}

export default ({ heading }:Props) => {
    const press = useContext(PressContext)
    const blogTitle = press.blog.config.blogTitle as string

    return (<div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">{blogTitle}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 dark:text-gray-400 sm:mt-4" dangerouslySetInnerHTML={{ __html: heading }}>
        </p>
    </div>)
}
