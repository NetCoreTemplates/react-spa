import { Link } from "react-router-dom"
import Layout from "@/components/Layout"
import GettingStarted from "@/components/GettingStarted"
import VideoGroup from "@/components/VideoGroup"
import SrcPage from "@/components/SrcPage"

const Index = () => {
    return (
        <Layout title="React SPA with Vite + TypeScript">
            <div className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
                        <span className="block xl:inline">Welcome to </span>
                        <span className="block text-link-dark dark:text-link-dark xl:inline">React SPA</span>
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                        Welcome to your new React SPA App, checkout links below to get started:
                    </p>
                    <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
                        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                            <Link to="https://ui.shadcn.com/docs/components/accordion" className="flex w-full items-center justify-center rounded-md border border-transparent bg-link-dark dark:bg-link-dark px-8 py-3 text-base font-medium text-white hover:bg-gray-700 md:py-4 md:px-10 md:text-lg">
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
                        <GettingStarted template="react-spa" />
                    </div>
                </div>
            </section>

            <div className="flex justify-center my-20 py-20 bg-slate-100 dark:bg-slate-800">
                <div className="text-center">
                    <svg className="text-link-dark dark:text-link-dark w-36 h-36 inline-block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m18 16l-4-3.2V16H6V8h8v3.2L18 8m2-4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" /></svg>
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
                        Videos
                    </h1>
                </div>
            </div>

            <VideoGroup
                title="Vue Components"
                summary="Learn about productive features in our growing Vue Component Library"
                group="vue"
                learnMore="https://docs.servicestack.net/vue/" />

            <div className="my-8 flex justify-center gap-x-4">
                <SrcPage path="pages/index.tsx" />
            </div>

        </Layout>
    )
}

export default Index
