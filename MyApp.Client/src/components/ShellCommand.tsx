import { Icon } from "@iconify/react"
import { MouseEvent, useState } from "react"

type Props = {
    className: string
    children: React.ReactNode
}

export default ({ className, children }: Props) => {
    
    let [successText, setSuccessText] = useState("")

    function copy(e: MouseEvent) {
        let $el = document.createElement("input")
        let $lbl = (e.target as HTMLElement).parentElement!.querySelector('label')!

        $el.setAttribute("value", $lbl.innerText)
        document.body.appendChild($el)
        $el.select()
        document.execCommand("copy")
        document.body.removeChild($el);

        if (typeof window.getSelection == "function") {
            const range = document.createRange()
            range.selectNodeContents($lbl)
            window.getSelection()?.removeAllRanges()
            window.getSelection()?.addRange(range)
        }

        setSuccessText('copied')
        setTimeout(() => setSuccessText(''), 3000)
    }
    return (<div className={`${className} relative bg-gray-700 text-gray-300 pl-5 py-3 sm:rounded flex`}>
        <div className="flex ml-2 w-full justify-between cursor-pointer" onClick={copy}>
          <div>
            <span>$ </span>
            <label className="cursor-pointer">
                {children}
            </label>
          </div>
          <small className="text-xs text-gray-400 px-3 -mt-1">sh</small>
        </div>
        {successText ?
          (<div className="absolute right-0 -mr-28 -mt-3 rounded-md bg-green-50 p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <Icon icon="mdi:check-circle" className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  { successText }
                </p>
              </div>
            </div>
          </div>)
          : null}
      </div>)
}
