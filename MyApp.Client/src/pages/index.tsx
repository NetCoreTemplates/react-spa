import { Link } from "react-router-dom"
import { Icon } from "@iconify/react"
import Layout from "@/components/Layout"
import GettingStarted from "@/components/GettingStarted"
import Include from "@/components/Include"
import VideoGroup from "@/components/VideoGroup"
import LiteYouTube from "@/components/LiteYouTube"
import SrcPage from "@/components/SrcPage"
import { generateSlug, dateLabel, dateTimestamp } from "@/utils"
import { PressContext } from "@/contexts"
import { useContext } from "react"

const Index = () => {
    const press = useContext(PressContext)
    const posts = press.blog.posts
    const primaryPost = posts[0]
    const postAuthor = primaryPost.author

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

    return (
        <Layout title="React SPA with Vite + TypeScript">
            <div className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
                        <span className="block xl:inline">Welcome to </span>
                        <span className="block text-link-dark dark:text-link-dark xl:inline">React SPA</span>
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                        Welcome to your new React SPA App
                    </p>
                    <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
                        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                            <Link to="https://ui.shadcn.com/docs/components/accordion"
                                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-link-dark dark:bg-link-dark px-8 py-3 text-base font-medium text-white hover:bg-gray-700 md:py-4 md:px-10 md:text-lg">
                                React Component Gallery
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-8 flex">
                <div className="mt-8 mx-auto">
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl text-center">
                        Getting Started
                    </h2>
                    <div>
                        <GettingStarted template="react-spa"/>
                    </div>
                </div>
            </section>

            <div className="relative">
                <div className="mt-8 max-w-6xl mx-auto">
                    <div className="aspect-w-16 aspect-h-9 pb-24">
                        <LiteYouTube id="WXLF0piz6G0" poster="maxresdefault"
                                     title="Productive ASP.NET Core Vite React SPA Tailwind Template with Identity Auth"/>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-5 mb-24">
                {!primaryPost ? null : <section>
                    <div className="mb-8 md:mb-16">
                        <div className="sm:mx-0">
                            <Link aria-label={primaryPost.title} to={postLink(primaryPost)}>
                                <img src={primaryPost.image} alt={`Cover Image for ${primaryPost.title}`}
                                     className="shadow-sm hover:shadow-2xl transition-shadow duration-200"/>
                            </Link>
                        </div>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
                        <div>
                            <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
                                <Link className="hover:underline" to={postLink(primaryPost)}>{primaryPost.title}</Link>
                            </h3>
                            <div className="mb-4 md:mb-0 text-lg">
                                <time dateTime={dateTimestamp(primaryPost.date)}>{dateLabel(primaryPost.date)}</time>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg leading-relaxed mb-4">{primaryPost.summary}</p>
                            {authorLink(primaryPost.author)
                                ? <Link className="flex items-center text-xl font-bold"
                                        to={authorLink(primaryPost.author)!}>
                                    <img src={authorProfileUrl(primaryPost.author)}
                                         className="w-12 h-12 rounded-full mr-4" alt="Author"/>
                                    <span>{postAuthor}</span>
                                </Link>
                                : <span className="flex items-center text-xl font-bold">
                                    <img src={authorProfileUrl(primaryPost.author)}
                                         className="w-12 h-12 rounded-full mr-4" alt="Author"/>
                                    <span>{postAuthor}</span>
                                  </span>}
                        </div>
                    </div>
                </section>}
            </div>

            <div className="flex justify-center my-20 py-20 bg-slate-100 dark:bg-slate-800">
                <div className="text-center">
                    <Icon icon="mdi:feature-highlight" className="text-link-dark w-36 h-36 inline-block"/>
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
                        Features
                    </h1>
                </div>
            </div>

            <div className="text-center text-xl">
                Opinionated React template for a productive out-of-the-box development UX
            </div>
            <div className="prose dark:prose-invert lg:prose-xl mx-auto">
                <Include src="features.md"/>
            </div>

            <div className="flex justify-center my-20 py-20 bg-slate-100 dark:bg-slate-800">
                <div className="text-center">
                    <Icon icon="material-symbols:hangout-video" className="text-link-dark w-36 h-36 inline-block"/>
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
                        Videos
                    </h1>
                </div>
            </div>

            <VideoGroup
                title="SPA Development"
                summary="Learn about ServiceStack's productive features for rapidly developing Single Page Apps"
                group="react"/>

            <div className="my-8 flex justify-center gap-x-4">
                <SrcPage path="index.tsx"/>
            </div>

        </Layout>
    )
}

export default Index
