import { Post } from "vite-plugin-press"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { PressContext } from "@/contexts"
import { generateSlug, dateLabel, dateTimestamp } from "@/utils"

type Props = {
    posts: Post[]
}

export default ({posts}: Props) => {
    const press = useContext(PressContext)

    function authorLink(name: any) {
        return name && press.blog.authors.some(x => x.name.toLowerCase() == name.toLowerCase())
            ? `/posts/author/${generateSlug(name)}`
            : null
    }

    function postLink(post: Post) {
        return `/posts/${post.slug}`
    }

    function author(name: string) {
        return name ? press.blog.authors.find(x => x.name.toLowerCase() == name.toLowerCase()) : undefined
    }

    function authorProfileUrl(name: string) {
        return author(name)?.profileUrl!
    }

    return (<div className="mx-auto grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
        {posts.map(post => <div key={post.path} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
            <div className="flex-shrink-0">
                <Link to={postLink(post)}>
                    <img className="h-48 w-full object-cover" src={post.image} alt=""/>
                </Link>
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white dark:bg-black p-6">
                <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                        Article
                    </p>
                    <Link to={postLink(post)} className="mt-2 block">
                        <p className="text-xl font-semibold text-gray-900 dark:text-gray-50 whitespace-nowrap overflow-hidden text-ellipsis" title={post.title}>
                            {post.title}
                        </p>
                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{post.summary}</p>
                    </Link>
                </div>
                <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                        <Link to={authorLink(post.author)!}>
                            <span className="sr-only">{post.author}</span>
                            <img className="h-10 w-10 rounded-full" src={authorProfileUrl(post.author)}
                                 alt={`${post.title} background`}/>
                        </Link>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                            {authorLink(post.author)
                                ? <Link to={authorLink(post.author)!} className="hover:underline">{post.author}</Link>
                                : <span>{post.author}</span>}
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <time dateTime={dateTimestamp(post.date)}>{dateLabel(post.date)}</time>
                            <span className="px-1" aria-hidden="true">&middot;</span>
                            <span>{post.minutesToRead} min read</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>)}
    </div>)
}
