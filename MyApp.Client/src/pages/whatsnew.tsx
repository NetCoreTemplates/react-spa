import MarkdownComponent from "@/components/MarkdownComponent"
import Layout from "@/components/Layout"
import SrcPage from "@/components/SrcPage"
import { leftPart, rightPart } from "@servicestack/client"
import { useContext } from "react"
import { PressContext } from "@/contexts"


export default () => {
    const press = useContext(PressContext)
    const releases = press.whatsNew

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    function releaseDate(release: string) {
        return leftPart(release, '_')
    }
    function releaseVersion(release: string) {
        return rightPart(release, '_')
    }

    return (<Layout title="What's New">
        <div className="container mx-auto px-5">
            <section className="flex-col md:flex-row flex justify-center mt-16 mb-16 md:mb-12">
                <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 dark:text-slate-50 sm:text-7xl">
                    Latest features & highlights
                </h1>
            </section>
        </div>
        <div className="relative px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
            {Object.entries(releases).map(([release, features]) => (
                <div key={release} className="relative mx-auto max-w-7xl">
                    <h2 className="text-center mb-4 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">{releaseVersion(release)}</h2>
                    <div className="text-center text-lg font-normal text-gray-500 dark:text-gray-400 mb-8">{formatDate(releaseDate(release))}</div>
                    {features.map(feature => (<div key={feature.path} className="flex flex-wrap my-24">
                        <div className="w-full sm:w-1/2 animated px-4">
                            <a href={feature.url}><img src={feature.image} alt="" loading="lazy" /></a>
                        </div>
                        <div className="w-full sm:w-1/2 text-left wow fadeInLeft animated px-4">
                            <h3 className="m-0 mb-4">
                                <a className="text-2xl font-normal text-blue-500 hover:text-blue-600" href={feature.url}>{feature.title}</a>
                            </h3>
                            <div className="prose dark:prose-invert max-w-none">
                                <MarkdownComponent type="whatsNew" doc={feature} group={release} />
                            </div>
                            <div className="text-center sm:text-left my-10">
                                <a href={feature.url} className="text-white text-sm font-semibold py-2.5 px-3.5 rounded outline-none focus:outline-none mr-1 mb-1 bg-slate-700 active:bg-slate-600 shadow hover:shadow-lg ease-linear transition-all duration-150">
                                    Learn more
                                </a>
                            </div>
                        </div>
                    </div>))}
                </div>
            ))}
        </div>
        <div className="my-8 flex justify-center gap-x-4">
            <SrcPage path="whatsnew.tsx"/>
        </div>
    </Layout>)
}