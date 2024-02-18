import { Icon } from "@iconify/react"
import { ErrorResponse, errorResponse, errorResponseExcept, ResponseStatus, humanize, toPascalCase } from "@servicestack/client"
import React, {
    FC,
    SyntheticEvent,
    useContext,
    createContext,
    useState
} from "react"
import classNames from "classnames"

export const ApiContext = createContext<ApiState>({ })
export type ApiState = {
    loading?: boolean
    error?: ResponseStatus
}

export function getRedirect(searchParams:URLSearchParams) {
    const redirect = searchParams.get('redirect')
    return redirect && Array.isArray(redirect)
        ? redirect[0]
        : redirect
}

const humanLabel = (s:string) => humanize(toPascalCase(s))

export type SuccessContext<T> = { response?:T }
export type SuccessEventHandler<T> = (ctx:SuccessContext<T>) => Promise<any> | void;

const input = {
    base:    'block w-full sm:text-sm rounded-md dark:text-white dark:bg-gray-900 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none',
    invalid: 'pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500',
    valid:   'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:border-gray-600',
}

type FormProps = {
    className?: string
    method?: string
    onSubmit: (e:SyntheticEvent<HTMLFormElement>) => Promise<any>|void
    onSuccess?: SuccessEventHandler<any>
    children: React.ReactNode
}
export const Form: FC<FormProps> = (props) => {
    const { className, method, onSubmit, onSuccess, children, ...remaining } = props
    const [error, setError] = useState<ResponseStatus|undefined>()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e:SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (onSubmit) {
            setLoading(true)
            try {
                setError(undefined)

                let response = await onSubmit(e)
                if (onSuccess) {
                    onSuccess({ response })
                }
            } catch (e:any) {
                setError(e.responseStatus ?? e)
            } finally {
                setLoading(false)
            }
        }
    }
    return (<ApiContext.Provider value={{ loading, error }}>
        <form method={method ?? 'POST'} className={className} onSubmit={handleSubmit} {...remaining}>{children}</form>
    </ApiContext.Provider>)
}

type ErrorSummaryProps = {
    status?: ResponseStatus
    className?: string
    except?: string | string[]
}
export const ErrorSummary: FC<ErrorSummaryProps> = ({ status, className, except }) => {
    const ctx = new ErrorResponse({
        responseStatus: status ?? useContext(ApiContext)?.error
    })
    const errorSummary = ctx.responseStatus ? errorResponseExcept.call(ctx,except ?? []) : null;
    if (!errorSummary) return null;

    return (<div className={classNames("bg-red-50 border-l-4 border-red-400 p-4",className)}>
        <div className="flex">
            <div className="flex-shrink-0">
                <Icon icon="mdi:close-circle" className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
                <p className="text-sm text-red-700">{errorSummary}</p>
            </div>
        </div>
    </div>)
};

type TextInputProps = {
    status?: ResponseStatus
    id: string
    type?: string
    className?: string
    placeholder?: string
    help?: string
    label?: string
} | any
export const TextInput: FC<TextInputProps> = ({ status, id, type, className, placeholder, help, label, ...remaining }) => {
    
    const useType = type ?? 'text'
    const useLabel = label ?? humanLabel(id)
    const usePlaceholder = placeholder ?? useLabel
    const useHelp = help ?? ''
    
    const ctx = new ErrorResponse({ 
        responseStatus: status ?? useContext(ApiContext)?.error 
    })
    const errorField = id && ctx.responseStatus && errorResponse.call(ctx,id)
    const hasErrorField = errorField != null
    
    const cssClass = (validCls?:string, invalidCls?:string) => [!hasErrorField ? validCls : invalidCls, className]

    if (!errorField && useHelp) {
        remaining['aria-describedby'] = `${id}-description`
    }
    
    return (<div>
        {!useLabel ? null : <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200">{useLabel}</label>}
        <div className="mt-1 relative rounded-md shadow-sm">
          <input type={useType} className={classNames([input.base, ...cssClass(input.valid,input.invalid)])}
            id={id} name={id} placeholder={usePlaceholder} {...remaining} />
        {!hasErrorField ? null : <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {/*Heroicon name: solid/exclamation-circle*/}
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>}
        </div>
        {hasErrorField 
            ? <p className="mt-2 text-sm text-red-500" id={`${id}-error`}>{errorField}</p>
            : useHelp
                ? <p id={`${id}-description`} className="text-gray-500 dark:text-gray-400">{useHelp}</p> : null}
      </div>)
}

type TextAreaInputProps = {
    status?: ResponseStatus
    id: string
    type?: string
    className?: string
    placeholder?: string
    help?: string
    label?: string
} | any
export const TextAreaInput: FC<TextAreaInputProps> = ({ status, id, className, placeholder, help, label, ...remaining }) => {

    const useLabel = label ?? humanLabel(id)
    const usePlaceholder = placeholder ?? useLabel
    const useHelp = help ?? ''

    const ctx = new ErrorResponse({
        responseStatus: status ?? useContext(ApiContext)?.error
    })
    const errorField = id && ctx.responseStatus && errorResponse.call(ctx,id)
    const hasErrorField = errorField != null

    const cssClass = (validCls?:string, invalidCls?:string) => [!hasErrorField ? validCls : invalidCls, className]

    if (!errorField && useHelp) {
        remaining['aria-describedby'] = `${id}-description`
    }

    return (<div>
        {!useLabel ? null : <label htmlFor={id} className="block text-sm font-medium text-gray-700">{useLabel}</label>}
        <div className="mt-1 relative rounded-md shadow-sm">
            <textarea className={classNames(['shadow-sm block w-full sm:text-sm rounded-md', ...cssClass(
                'text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
                'text-red-900 focus:ring-red-500 focus:border-red-500 border-red-300')])}
                   id={id} name={id} placeholder={usePlaceholder} {...remaining}/>
        </div>
        {hasErrorField
            ? <p className="mt-2 text-sm text-red-500" id={`${id}-error`}>{errorField}</p>
            : useHelp
                ? <p id={`${id}-description`} className="text-gray-500">{useHelp}</p> : null}
    </div>)
}

type SelectInputProps = {
    status?: ResponseStatus
    id: string
    className?: string
    placeholder?: string
    label?: string
    options?: any
    values?: string[]
} | any
export const SelectInput: FC<SelectInputProps> = ({ status, id, className, placeholder, help, label, options, values, ...remaining }) => {

    const useLabel = label ?? humanLabel(id)
    const usePlaceholder = placeholder ?? useLabel

    const ctx = new ErrorResponse({
        responseStatus: status ?? useContext(ApiContext)?.error
    })
    const errorField = id && ctx.responseStatus && errorResponse.call(ctx,id)
    const hasErrorField = errorField != null

    const cssClass = (validCls?:string, invalidCls?:string) => [!hasErrorField ? validCls : invalidCls, className]
    
    const kvpValues = () => values
        ? values.map((x:string) => ({ key:x, value:x }))
        : options
            ? Object.keys(options).map(key => ({ key, value:options[key] }))
            : []

    return (<>
        {!useLabel ? null : <label htmlFor={id} className="block text-sm font-medium text-gray-700">{useLabel}</label>}
        <select className={classNames(['mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none border-gray-300 sm:text-sm rounded-md', ...cssClass(
            'text-gray-900 focus:ring-indigo-500 focus:border-indigo-500',
            'text-red-900 focus:ring-red-500 focus:border-red-500')])}
                id={id} name={id} placeholder={usePlaceholder} {...remaining}>
            {kvpValues().map(({key,value}:{key:string,value:string}) => <option key={key} value={key}>{value}</option>)}
        </select>
        {!hasErrorField ? null : <p className="mt-2 text-sm text-red-500" id={`${id}-error`}>{errorField}</p>}
    </>)
}


type CheckboxProps = {
    status?: ResponseStatus
    id: string
    label: string
    help?: string
} | any
export const Checkbox: FC<CheckboxProps> = ({ status, id, label, help, ...remaining }) => {

    const useLabel = label ?? humanLabel(id)

    const ctx = new ErrorResponse({
        responseStatus: status ?? useContext(ApiContext)?.error
    })
    const errorField = id && ctx.responseStatus && errorResponse.call(ctx,id)
    const hasErrorField = errorField != null

    return (<div className="relative flex items-start">
        <div className="flex items-center h-5">
            <input
                id={id}
                name={id}
                type="checkbox"
                value="true"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                {...remaining} />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={id} className="font-medium text-gray-700 dark:text-gray-200 select-none">{useLabel}</label>
            {hasErrorField 
                ? <p className="mt-2 text-sm text-red-500" id="`${id}-error`">{errorField}</p>
                : help 
                    ? <p className="mt-2 text-sm text-gray-500" id="`${id}-description`">{help}</p>
                    : null}
        </div>
    </div>)
}

type CloseButtonProps = {
    onClose: () => void
}
export const CloseButton: FC<CloseButtonProps> = ({ onClose }) => {
    return (<div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
        <button type="button" onClick={_ => onClose()}
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <span className="sr-only">Close</span>
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
             aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
    </button>
</div>)
}

type ConfirmDeleteProps = {
    onDelete: () => void
    children: React.ReactNode
}
export const ConfirmDelete: FC<ConfirmDeleteProps> = ({ onDelete, children, ...remaining }) => {
    
    const [deleteConfirmed, setDeleteConfirmed] = useState<boolean>(false)
    
    const onChange:React.ChangeEventHandler<HTMLInputElement> = (e) => setDeleteConfirmed(e.target.checked)

    const onClick:React.MouseEventHandler<HTMLSpanElement> = (e) => {
        e.preventDefault()
        if (deleteConfirmed) onDelete()
    }

    const cls = ["select-none inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white",
        deleteConfirmed ? "cursor-pointer bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" : "bg-red-400"].join(' ')

    return (<>
        <input id="confirmDelete" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
               checked={deleteConfirmed} onChange={onChange} />
        <label htmlFor="confirmDelete" className="mx-2 select-none">confirm</label>
        <span onClick={onClick} className={cls} {...remaining}>
            {children}
        </span>
    </>)
}

type LoadingProps = {
    className?: string
    loading?: boolean
    icon?: boolean
    text?: string
}
export const FormLoading: FC<LoadingProps> = (props) => {
    const loading = props.loading ?? useContext(ApiContext)?.loading
    if (!loading) return null
    return Loading(props)
}

export const Loading : FC<LoadingProps> = ({ className, icon, text }) => {
    const showIcon = icon || icon === undefined;
    const showText = text === undefined ? "loading..." : text;
    let cls = ["flex", className];

    return (<div className={cls.join(' ')} title="loading...">
    {showIcon ? (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30">
      <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>) : null}
    <span className="ml-1 text-gray-400">{showText}</span>
  </div>)
}