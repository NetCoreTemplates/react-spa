import { cn } from "@/utils"

type Props = {
    files?: { [dir: string]: any }
    label?: string | number
    contents?: any
}

function FileLayout({ files, label, contents }:Props) {
    return (<>
        {files 
            ? <div>
                {Object.entries(files!).map(([label,contents]) => 
                    <FileLayout key={label} label={label} contents={contents} />)}
              </div>
            : <div>
                { label === '_'
                    ? (<div>
                        {Object.values(contents).map((file:any) =>
                            <div key={file} className="ml-6 flex items-center text-base leading-8">
                                <svg className="mr-1 text-slate-600 inline-block select-none align-text-bottom overflow-visible" aria-hidden={true} focusable={false} role="img" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path></svg>
                                <span>{file}</span>
                            </div>)}
                       </div>)
                    : (<div>
                        <div className="ml-6">
                            <div className="flex items-center text-base leading-8">
                                <svg className={cn('mr-1 text-slate-600 inline-block select-none align-text-bottom overflow-visible', Object.keys(contents ?? []).length == 0 ? '-rotate-90' : '')} aria-hidden="true" focusable="false" role="img" viewBox="0 0 12 12" width="12" height="12" fill="currentColor"><path d="M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.7 2.7-2.7c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z"></path></svg>
                                <svg className="mr-1 text-sky-500" aria-hidden="true" focusable="false" role="img" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.978a1 1 0 0 1 .994 1.117L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.91.513-1.237Z"></path></svg>
                                <span>{label}</span>
                            </div>
                            {Object.entries(contents ?? {}).map(([childLabel,node]) => 
                                <FileLayout key={childLabel} label={childLabel} contents={node} />)}
                        </div>
                    </div>)
                }
              </div>}
    </>)
}
export default FileLayout
