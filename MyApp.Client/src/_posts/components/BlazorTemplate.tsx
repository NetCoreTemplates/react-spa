import Templates from "./Templates"
import Index from "./TemplateIndex"

export default () => {
    return <Templates templates={[Index['blazor']]} />
}