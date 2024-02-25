import { cn } from "@/utils"
import { type Template, Icons } from './TemplateIndex'
import { ChangeEvent, useMemo, useState } from "react"

type Props = {
    templates: Template[]
    hide?: string
}

export default ({templates, hide}: Props) => {
    let defaultValue = 'ProjectName'
    let [project, setProject] = useState(defaultValue)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setProject(e.target.value);

    const zipUrl = (template: string) =>
        `https://account.servicestack.net/archive/${template}?Name=${project || 'MyApp'}`
    const projectZip = useMemo(() => (project || 'MyApp') + '.zip', [project])

    function validateSafeName(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key.match(/[\W]+/g)) {
            e.preventDefault()
            return false
        }
    }

    const icons: { [name: string]: string } = Icons
    const svgIcon = (icon: string) => icons[icon] ?? Icons.ServiceStack

    return (<div>
        <section className="w-full flex flex-col justify-center text-center">
            <div id="empty" className="mt-4 mb-2">
                <div className="flex justify-center mb-8">
                    <div className="w-70">
                        <input type="text" onChange={handleChange} defaultValue={defaultValue} autoComplete="off"
                               spellCheck="false" onKeyDown={validateSafeName}
                               className="mb-8 sm:text-lg rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:bg-gray-800"/>
                    </div>
                </div>
            </div>
        </section>
        <section className={cn('w-full grid gap-4 text-center', templates.length === 1
            ? 'grid-cols-1'
            : templates.length === 2
                ? 'grid-cols-2 max-w-md mx-auto'
                : 'grid-cols-3')}>
            {templates.map(template => <div key={template.repo} className="mb-2">
                <div className="flex justify-center text-center">
                    <a className="archive-url hover:no-underline" href={zipUrl('NetCoreTemplates/' + template.repo)}>
                        <div
                            className="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600 dark:border-2 dark:border-pink-600 dark:hover:border-blue-600"
                            style={{minWidth: '150px'}}>
                            <div className="text-center font-extrabold flex items-center justify-center mb-2">
                                <div className="text-4xl text-blue-400 my-3"
                                     dangerouslySetInnerHTML={{__html: svgIcon(template.icon)}}></div>
                            </div>
                            <div className="text-xl font-medium text-gray-700">{template.name}</div>
                            <div className="flex justify-center h-8">
                                {template.tags.map(tag => <div key={tag} className="mr-1">
                                <span
                                    className="px-2 h-8 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-400 text-sm">{tag}</span>
                                </div>)}
                            </div>
                            <span
                                className="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{projectZip}</span>
                            <div className="count mt-1 text-gray-400 text-sm"></div>
                        </div>
                    </a>
                </div>
                {template.demo && hide !== 'demo' ? <a href={'https://' + template.demo}>{template.demo}</a> : null}
            </div>)}
        </section>
    </div>)
}