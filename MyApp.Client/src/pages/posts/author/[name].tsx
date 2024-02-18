import { Link } from "react-router-dom"
import BlogTitle from "@/components/BlogTitle"
import BlogPosts from "@/components/BlogPosts"
import { ErrorSummary } from "@/components/Form"

import { useContext } from "react"
import { useParams } from "react-router-dom"
import { PressContext } from "@/contexts"
import { generateSlug } from "@/utils"
import Layout from "@/components/Layout"

export default () => {
    const press = useContext(PressContext)
    const { name } = useParams()
    const author = press.blog.authors.find(x => generateSlug(x.name) == name)
    const authorPosts = author ? press.blog.posts.filter(x => x.author.toLowerCase() == author.name.toLowerCase()) : []
    const title = author ? `${author.name}'s Posts` : `Author Not Found`

    return (
        <Layout title={title}>
            {author
                ? <div className="relative bg-gray-50 dark:bg-gray-900 px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
                    <div className="absolute inset-0">
                        <div className="h-1/3 bg-white dark:bg-black sm:h-2/3"></div>
                    </div>
                    <div className="relative mx-auto max-w-7xl">
                        <BlogTitle heading={`All posts written by <b>${author.name}</b>`} />
                    </div>
                    <div className="mt-12 relative mx-auto max-w-7xl">
                        <BlogPosts posts={authorPosts} />

                        <div className="mt-8 text-center">
                            <Link className="text-sm font-semibold hover:underline" to="/posts">view all posts</Link>
                        </div>
                    </div>
                </div>
                : <ErrorSummary status={{ errorCode: 'NotFound', message: `Author ${name} was not found` }} />}
        </Layout>
    )
}
