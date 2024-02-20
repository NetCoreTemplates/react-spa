import { combinePaths } from "@servicestack/client"
import { Icon } from "@iconify/react"
import SrcLink from "@/components/SrcLink"

type Props = {
    path: string
}

export default ({ path }:Props) => (
    <SrcLink href={combinePaths('/MyApp.Client/src/pages',path)}>
        <Icon icon="mdi:react" className="w-5 h-5 text-link-dark inline" />
    </SrcLink>
)