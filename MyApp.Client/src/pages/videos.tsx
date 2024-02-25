import VideoGroup from "@/components/VideoGroup"
import Layout from "@/components/Layout"
import SrcPage from "@/components/SrcPage"
import { Icon } from "@iconify/react"

export default () => {
    const title = "Videos"

    return (<>
        <Layout title={title}>
            <div className="flex justify-center my-10">
                <div className="text-center">
                    <Icon icon="material-symbols:hangout-video" className="text-green-600 w-36 h-36 inline-block" />
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
                        {title}
                    </h1>
                </div>
            </div>

            <VideoGroup
                title="SPA Development"
                summary="Learn about ServiceStack's productive features for rapidly developing Single Page Apps"
                group="react"/>

            <div className="my-8 flex justify-center gap-x-4">
                <SrcPage path="videos.tsx"/>
            </div>

        </Layout>
    </>)
}