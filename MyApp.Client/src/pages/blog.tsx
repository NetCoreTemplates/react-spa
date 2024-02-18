import Layout from "@/components/Layout"
import SrcPage from "@/components/SrcPage"
import FollowLinks from "@/components/FollowLinks"
import Logo from "@/assets/img/logo.svg?react"
import { HelmetProvider, Helmet } from "react-helmet-async"
import { useContext } from "react"
import { PressContext } from "@/contexts"
import { generateSlug, dateLabel, dateTimestamp } from "@/utils"


export default () => {
    const press = useContext(PressContext)
    const title = press.blog.config.blogTitle

    function authorLink(name: any) {
        return name && press.blog.authors.some((x: any) => x.name.toLowerCase() == name.toLowerCase())
            ? `/posts/author/${generateSlug(name)}`
            : null
    }
    function postLink(post: any) {
        return `/posts/${post.slug}`
    }
    function author(name: string) {
        return name ? press.blog.authors.filter((x: any) => x.name.toLowerCase() == name.toLowerCase())[0] : null
    }
    function authorProfileUrl(name: string) {
        return author(name)?.profileUrl ?? "/img/profiles/user1.svg"
    }

    const posts = press.blog.posts
    const primaryPost = posts[0]
    const postAuthor = primaryPost.author
    const gridPosts = posts.slice(1, 7)
    const remainingPosts = posts.slice(7, 22)

    return (<>
        <Layout>
            <HelmetProvider>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
            </HelmetProvider>
            <div className="container mx-auto px-5 mt-24 mb-24">
                {!primaryPost ? null : (<section>
                    <div className="mb-8 md:mb-16">
                        <div className="sm:mx-0">
                            <a aria-label={primaryPost.title} href={postLink(primaryPost)}>
                                <img src={primaryPost.image} alt={`Cover Image for ${primaryPost.title}`} className="shadow-sm hover:shadow-2xl transition-shadow duration-200" />
                            </a>
                        </div>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
                        <div>
                            <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
                                <a className="hover:underline" href="postLink(primaryPost)">{primaryPost.title}</a>
                            </h3>
                            <div className="mb-4 md:mb-0 text-lg">
                                <time dateTime={dateTimestamp(primaryPost.date)}>{dateLabel(primaryPost.date)}</time>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg leading-relaxed mb-4">{primaryPost.summary}</p>
                            {authorLink(primaryPost.author) 
                                ? (<a className="flex items-center text-xl font-bold" href={authorLink(primaryPost.author)!}>
                                    <img src={authorProfileUrl(primaryPost.author)} className="w-12 h-12 rounded-full mr-4" alt="Author" />
                                        <span>{postAuthor}</span>
                                    </a>)
                                : (<span className="flex items-center text-xl font-bold">
                                    <img src={authorProfileUrl(primaryPost.author)} className="w-12 h-12 rounded-full mr-4" alt="Author" />
                                        <span>{postAuthor}</span>
                                    </span>)}
                        </div>
                    </div>
                </section>)}

                {!gridPosts.length ? null : (<section>
                    <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">More from the blog</h2>
                    <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
                        {gridPosts.map(post => <div key={post.path} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                            <div className="flex-shrink-0">
                                <a href={postLink(post)}>
                                    <img className="h-48 w-full object-cover" src={post.image} alt="" />
                                </a>
                            </div>
                            <div className="flex flex-1 flex-col justify-between bg-white dark:bg-black p-6">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                                        Article
                                    </p>
                                    <a href={postLink(post)} className="mt-2 block">
                                        <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">{post.title}</p>
                                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{post.summary}</p>
                                    </a>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="flex-shrink-0">
                                        <span>
                                            <span className="sr-only">{post.author}</span>
                                            <img className="h-10 w-10 rounded-full" src={authorProfileUrl(post.author)} alt={`${post.title} background`} />
                                        </span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                            {authorLink(post.author)
                                                ? <a href={authorLink(post.author)!} className="hover:underline">{post.author}</a>
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
                    </div>
                </section>)}

                {!remainingPosts.length ? null : (<section className="mt-24 flex justify-center">
                    <div className="flex max-w-screen-lg">
                        <div className="w-2/3">
                            {remainingPosts.map(post => (<div key={post.path} className="border-b pb-4 mb-4">
                                <div className="flex justify-between">
                                    <div className="w-3/4">
                                        <a href={postLink(post)} className="mt-2 block">
                                            <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">{post.title}</p>
                                            <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{post.summary}</p>
                                        </a>
                                        <div className="mt-6 flex items-center">
                                            <div className="flex-shrink-0">
                                                <span>
                                                    <span className="sr-only">{post.author}</span>
                                                    <img className="h-10 w-10 rounded-full" src={authorProfileUrl(post.author)} alt={`${post.title} background`} />
                                                </span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                                    {authorLink(post.author)
                                                        ? <a href={authorLink(post.author)!} className="hover:underline">{post.author}</a>
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
                                    <div className="w-1/4">
                                        <a href={postLink(post)} className="pt-4">
                                            <img className="w-full object-cover max-h-[130px]" src={post.image} alt="" />
                                        </a>
                                    </div>
                                </div>
                            </div>))}
                        </div>
                        <div className="w-1/3">
                            <div className="pl-8">
                                <div className="flex items-center">
                                    <Logo className="w-8 h-8 mr-1" title="MyApp logo" />
                                    <span className="hidden sm:block text-lg font-semibold">MyApp</span>
                                </div>
                                <div className="p-2">
                                    <p className="text-gray-500">I’m Spencer Sharp. I live in New York City, where I design the future.</p>
                                    <a href="/about" className="text-sm font-medium text-gray-900 hover:underline">more information</a>
                                </div>
                                <div className="p-4">
                                    <FollowLinks />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>)}
            </div>
            <div className="my-8 flex justify-center gap-x-4">
                <SrcPage path="pages/blog.vue" />
            </div>
        </Layout>
    </>)
}