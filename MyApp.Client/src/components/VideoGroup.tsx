import LiteYouTube from "@/components/LiteYouTube"
import MarkdownComponent from "@/components/MarkdownComponent"
import { lastRightPart } from "@servicestack/client"
import { useContext } from "react"
import { PressContext } from "@/contexts"
import { cn } from "@/utils"


type Props = {
    group: string
    title?: string
    background?: string
    summary?: string
    learnMore?: string
}

export default ({ group, title, background, summary, learnMore }: Props) => {

    const press = useContext(PressContext)
    const videos = press.videos[group]

    function videoId(url: string) {
        return lastRightPart(url, '/')
    }

    function dateFmt(date: string) {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    return (<div className={cn(background,'py-24 sm:py-32')}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">{title}</h2>
                <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
                    {summary}
                    {learnMore
                        ? <a href={learnMore} className="ml-2 text-sm font-semibold leading-6">Learn more <span aria-hidden="true">→</span></a>
                        : null}
                </p>
                <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
                    {videos.map(video => (
                        <article key={video.url} className="relative isolate flex flex-col gap-8 lg:flex-row">
                        <div className="relative lg:w-1/2 lg:shrink-0">
                            <LiteYouTube id={videoId(video.url)} title={video.title} />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-4 text-xs">
                                <time dateTime="2020-03-16" className="text-gray-500 dark:text-gray-400">{dateFmt(video.date)}</time>
                                {video.tags.map(tag => 
                                    (<span key={tag} className="relative z-10 rounded-full bg-gray-50 dark:bg-gray-800 py-1.5 px-3 font-medium text-gray-600 dark:text-gray-300">
                                        {tag}
                                    </span>))}
                            </div>
                            <div className="group relative max-w-xl">
                                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-50 group-hover:text-gray-600 dark:group-hover:text-gray-400">
                                    <a href={video.url}>
                                        {video.title}
                                    </a>
                                </h3>
                                <div className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                    <div className="prose dark:prose-invert">
                                        <MarkdownComponent type="videos" doc={video} group={group} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>))}
                </div>
            </div>
        </div>
    </div>)
}
