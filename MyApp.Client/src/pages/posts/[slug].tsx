import Layout from "@/components/Layout"
import { Link } from "react-router-dom"
import AuthorLinks from "@/components/AuthorLinks"
import { useContext } from "react"
import { PressContext } from "@/contexts"
import { HelmetProvider, Helmet } from "react-helmet-async"
import { generateSlug, dateLabel, dateTimestamp } from "@/utils"
import { useParams } from "react-router-dom"
import MarkdownComponent from "@/components/MarkdownComponent"
import { ErrorSummary } from "@/components/Form"

export default (): JSX.Element => {
    const press = useContext(PressContext)

    const { slug } = useParams()
    const allPosts = press.blog.posts
    const post = allPosts.find(x => x.slug == slug)
    const title = post?.title ?? "Post not found"

    const author = post ? press.blog.authors.find(x => x.name.toLowerCase() == post.author?.toLowerCase()) : null
    const authorPosts = author ? allPosts.filter(x => x.author?.toLowerCase() == author!.name.toLowerCase()).slice(0, 4) : []
    const authorProfileUrl = author?.profileUrl ?? "/img/profiles/user1.svg"
    const authorHref = author ? `/posts/author/${generateSlug(author.name)}` : null

    function postLink(post: any) {
        return `/posts/${post.slug}`
    }
    function tagLink(tag: string) {
        return `/posts/tagged/${generateSlug(tag)}`
    }
    function authorLink(name: any) {
        return name && press.blog.authors.some((x: any) => x.name.toLowerCase() == name.toLowerCase())
            ? `/posts/author/${generateSlug(name)}`
            : null
    }

    return (
        <Layout>
            <HelmetProvider>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
            </HelmetProvider>
            {post ? (<>
                <div className="container px-5 mb-32 mx-auto">
                    <article className="mt-20">
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
                            {post.title}
                        </h1>
                        <div className="flex justify-between">
                            <div className="md:mb-12 flex items-center">
                                {authorHref
                                    ? <Link to={authorHref}><img className="w-12 h-12 rounded-full mr-4 text-cyan-600" src={authorProfileUrl} /></Link>
                                    : <img className="w-12 h-12 rounded-full mr-4 text-cyan-600" src={authorProfileUrl} />}

                                {!author ? null : (<div className="flex flex-col">
                                    {authorHref
                                        ? <Link className="text-xl font-semibold hover:underline" to={authorHref}>{post.author}</Link>
                                        : <span className="text-xl font-semibold">{post.author}</span>}
                                    <AuthorLinks author={author} />
                                </div>)}
                            </div>
                        </div>
                        <div className="mb-8 md:mb-16 sm:mx-0">
                            <div className="sm:mx-0">
                                <img src={post.image} alt={`${post.title} Background`} className="shadow-small" />
                            </div>
                        </div>
                        <div className="flex max-w-3xl mx-auto justify-between">
                            <div>
                                <div className="mb-4 flex flex-wrap">
                                    {post.tags.map(tag =>
                                        <Link key={tag} to={tagLink(tag)} className="mr-2 mb-2 text-xs leading-5 font-semibold bg-slate-400/10 dark:bg-slate-400/30 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:hover:bg-slate-400/40 dark:highlight-white/5">{tag}</Link>)}
                                </div>
                                {!post.date ? null : <div className="max-w-3xl mx-auto">
                                    <div className="mb-6 text-lg text-gray-500 dark:text-gray-400">
                                        <time dateTime={dateTimestamp(post.date)}>{dateLabel(post.date)}</time>
                                        <span className="px-1" aria-hidden="true">&middot;</span>
                                        <span>{post.wordCount} min read</span>
                                    </div>
                                </div>}

                            </div>
                        </div>
                        <div className="max-w-3xl mx-auto">
                            <div id="post" className="prose dark:prose-invert lg:prose-xl max-w-none mb-32">
                                <MarkdownComponent type="blog" doc={post} />
                            </div>
                        </div>
                    </article>
                </div>

                {!author || !authorPosts.length ? null :
                    (<div className="bg-gray-50 dark:bg-gray-900 py-20">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex justify-between">
                                <div>
                                    {authorHref
                                        ? <Link to={authorHref}><img className="w-20 h-20 rounded-full text-cyan-600" src={authorProfileUrl} /></Link>
                                        : <img className="w-20 h-20 rounded-full text-cyan-600" src={authorProfileUrl} />}

                                    <div className="mt-2 font-medium text-2xl">
                                        Written by {author.name}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300">
                                        {author.bio}
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <AuthorLinks author={author} />
                                </div>
                            </div>
                            <div className="mt-4 border-t">
                                <div className="py-8 text-lg text-gray-700 dark:text-gray-200 font-medium">
                                    More from {author.name}
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    {authorPosts.map(authorPost => (<div key={authorPost.path}>
                                        <div className="flex flex-col overflow-hidden">
                                            <div className="flex-shrink-0">
                                                <Link to={postLink(authorPost)}>
                                                    <img className="h-48 w-full object-cover" src={authorPost.image} alt="" />
                                                </Link>
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between bg-white dark:bg-black p-6">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                                                        Article
                                                    </p>
                                                    <Link to={postLink(authorPost)} className="mt-2 block">
                                                        <p className="text-xl font-semibold text-gray-900 dark:text-gray-50 whitespace-nowrap overflow-hidden text-ellipsis" title={authorPost.title}>
                                                            {authorPost.title}
                                                        </p>
                                                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{authorPost.summary}</p>
                                                    </Link>
                                                </div>
                                                <div className="mt-6 flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <span className="sr-only">{authorPost.author}</span>
                                                        <img className="h-10 w-10 rounded-full" src={authorProfileUrl} alt={`${authorPost.title} background`} />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                                            {authorLink(authorPost.author)
                                                                ? <Link to={authorLink(authorPost.author)!} className="hover:underline">{authorPost.author}</Link>
                                                                : <span>{authorPost.author}</span>}
                                                        </p>
                                                        <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                                            <time dateTime={dateTimestamp(authorPost.date)}>{dateLabel(authorPost.date)}</time>
                                                            <span className="px-1" aria-hidden="true">&middot;</span>
                                                            <span>{authorPost.minutesToRead} min read</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>))}

                                </div>
                            </div>
                        </div>
                    </div>)}
            </>)
                : (<div className="mt-3 mb-20 mx-auto max-w-fit">
                    <ErrorSummary status={{ errorCode: 'NotFound', message: `Post ${slug} was not found` }} />
                </div>)}
        </Layout>)
}
