import { Link } from "react-router-dom"
import Layout from "@/components/Layout"
import BlogTitle from "@/components/BlogTitle"
import BlogPosts from "@/components/BlogPosts"
import { ErrorSummary } from "@/components/Form"

import { useContext } from "react"
import { useParams } from "react-router-dom"
import { PressContext } from "@/contexts"
import { generateSlug } from "@/utils"
import { HelmetProvider, Helmet } from "react-helmet-async"

export default () => {
    const press = useContext(PressContext)
    const { tag } = useParams()

    const selectedTag = tag && press.blog.tagSlugs[tag]
    const title = `${selectedTag} tagged posts`
    const allPosts = press.blog.posts
    const taggedPosts = selectedTag ? allPosts.filter(x => x.tags.includes(selectedTag)) : []
    const allTags = [...new Set(allPosts.flatMap(x => x.tags))]
    const tagCounts: { [tag: string]: number } = {}
    allTags.forEach(tag => tagCounts[tag] = allPosts.filter(x => x.tags.includes(tag)).length)
    allTags.sort((a: string, b: string) => tagCounts[b] - tagCounts[a])

    function tagLink(tag: string) {
        return `/posts/tagged/${generateSlug(tag)}`
    }

    return (
        <Layout>
            <HelmetProvider>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
            </HelmetProvider>
            {selectedTag
                ? <div className="relative bg-gray-50 dark:bg-gray-900 px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
                    <div className="absolute inset-0">
                        <div className="h-1/3 bg-white dark:bg-black sm:h-2/3"></div>
                    </div>
                    <div className="relative mx-auto max-w-7xl">
                        <BlogTitle heading={`All posts tagged in <b>${selectedTag}</b>`} />
                    </div>
                    <div className="relative my-4 mx-auto max-w-7xl">
                        <div className="flex flex-wrap justify-center">
                            {allTags.map(tag => tag == selectedTag
                                ? <span className="mr-2 mb-2 text-xs leading-5 font-semibold bg-indigo-600 text-white rounded-full py-1 px-3 flex items-center space-x-2">{tag}</span>
                                : <Link to={tagLink(tag)} className="mr-2 mb-2 text-xs leading-5 font-semibold bg-slate-400/10 dark:bg-slate-400/30 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:hover:bg-slate-400/40 dark:highlight-white/5">{tag}</Link>)}
                        </div>
                    </div>
                    <div className="mt-12 relative mx-auto max-w-7xl">
                        <BlogPosts posts={taggedPosts} />
                        <div className="mt-8 text-center">
                            <Link className="text-sm font-semibold hover:underline" to="/posts">view all posts</Link>
                        </div>
                    </div>
                </div>
                : <ErrorSummary status={{ errorCode: 'NotFound', message: `Posts tagged with ${tag} was not found` }} />}
        </Layout>
    )
}
