import { Link } from "react-router-dom"
import BlogTitle from "@/components/BlogTitle"
import BlogPosts from "@/components/BlogPosts"
import SrcPage from "@/components/SrcPage"

import { useContext } from "react"
import { PressContext } from "@/contexts"
import { generateSlug } from "@/utils"
import Layout from "@/components/Layout"

type Props = {}
export default ({ }: Props) => {

    const press = useContext(PressContext)
    const title = press.blog.config.blogTitle
    const blogDescription = press.blog.config.blogDescription
    const allPosts = press.blog.posts
    const allYears = [...new Set(allPosts.map((x: any) => new Date(x.date).getFullYear()) as number[])]
    const allTags = [...new Set(allPosts.flatMap((x: any) => x.tags) as string[])]
    const tagCounts: { [tag: string]: number } = {}
    allTags.forEach(tag => tagCounts[tag] = allPosts.filter((x: any) => x.tags.includes(tag)).length)
    allTags.sort((a: string, b: string) => tagCounts[b] - tagCounts[a])

    function tagLink(tag: string) {
        return `/posts/tagged/${generateSlug(tag)}`
    }
    function yearLink(year: number) {
        return `/posts/year/${year}`
    }
    const thisYear = new Date().getFullYear()

    return (
        <Layout title={title}>
            <>
                <div className="relative bg-gray-50 dark:bg-gray-900 px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
                    <div className="absolute inset-0">
                        <div className="h-1/3 bg-white dark:bg-black sm:h-2/3"></div>
                    </div>
                    <div className="relative mx-auto max-w-7xl">
                        <BlogTitle heading={blogDescription} />
                    </div>
                    <div className="relative my-4 mx-auto max-w-7xl">
                        <div className="flex flex-wrap justify-center">
                            {allTags.map(tag =>
                                <Link key={tag} to={tagLink(tag)} className="mr-2 mb-2 text-xs leading-5 font-semibold bg-slate-400/10 dark:bg-slate-400/30 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:hover:bg-slate-400/40 dark:highlight-white/5">{tag}</Link>)}
                        </div>
                    </div>
                    <div className="relative mb-8 mx-auto max-w-7xl">
                        <div className="flex flex-wrap justify-center">
                            <b className="text-sm font-semibold">{thisYear}</b>
                            {allYears.filter(x => x != thisYear).map(year =>
                                <Link key={year} className="ml-3 text-sm text-indigo-700 dark:text-indigo-300 font-semibold hover:underline" to={yearLink(year)}>{year}</Link>)}
                        </div>
                    </div>
                    <div className="relative mx-auto max-w-7xl">
                        <BlogPosts posts={allPosts.filter((x: any) => new Date(x.date).getFullYear() == thisYear)} />
                        <div className="mt-8 text-center">
                            <Link className="text-sm font-semibold hover:underline" to="/posts">view all posts</Link>
                        </div>
                    </div>
                </div>

                <div className="my-8 flex justify-center gap-x-4">
                    <SrcPage path="posts/index.tsx" />
                </div>
            </>
        </Layout>
    )
}
