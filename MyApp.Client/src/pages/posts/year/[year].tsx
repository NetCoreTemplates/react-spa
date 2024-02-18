import { Link } from "react-router-dom"
import Layout from "@/components/Layout"
import BlogTitle from "@/components/BlogTitle"
import BlogPosts from "@/components/BlogPosts"
import { ErrorSummary } from "@/components/Form"

import { useContext } from "react"
import { useParams } from "react-router-dom"
import { PressContext } from "@/contexts"

export default () => {
    const press = useContext(PressContext)
    const forYear = parseInt(useParams().year ?? '')
    const title = `${forYear} posts`
    const allPosts = press.blog.posts
    const allYears = [...new Set(allPosts.map(x => new Date(x.date).getFullYear()))]
    allYears.sort((a: number, b: number) => b - a)
    const yearPosts = allPosts.filter((x: any) => new Date(x.date).getFullYear() == forYear)
    yearPosts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

    function yearLink(year: number) {
        return `/posts/year/${year}`
    }

    return (
        <Layout title={title}>
            {yearPosts.length
                ? <div className="relative bg-gray-50 dark:bg-gray-900 px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
                    <div className="absolute inset-0">
                        <div className="h-1/3 bg-white dark:bg-black sm:h-2/3"></div>
                    </div>
                    <div className="relative mx-auto max-w-7xl">
                        <BlogTitle heading={`All posts published in <b>${forYear}</b>`} />
                    </div>
                    <div className="mt-4 relative mb-8 mx-auto max-w-7xl">
                        <div className="flex flex-wrap justify-center">
                            {allYears.map(year => forYear == year
                                ? <b className="ml-3 text-sm font-semibold">{ year }</b>
                                : <Link className="ml-3 text-sm text-indigo-700 dark:text-indigo-300 font-semibold hover:underline" to={yearLink(year)}>{year}</Link>)}
                        </div>
                    </div>
                    <div className="mt-12 relative mx-auto max-w-7xl">
                        <BlogPosts posts={yearPosts} />
                        <div className="mt-8 text-center">
                            <Link className="text-sm font-semibold hover:underline" to="/posts">view all posts</Link>
                        </div>
                    </div>
                </div>
                : <ErrorSummary status={{ errorCode: 'NotFound', message: `Posts published in ${forYear} was not found` }} />}
        </Layout>
    )
}
