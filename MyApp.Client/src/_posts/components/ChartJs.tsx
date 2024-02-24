import { useEffect, useRef } from "react"
import { addScript } from "@servicestack/client"

const loadJs = addScript('https://cdn.jsdelivr.net/npm/chart.js/dist/chart.umd.min.js')

declare var Chart:any

type Props = { type?:string, data?:any, options?:any }

export default ({ type, data, options }:Props) => {
    const canvas = useRef<HTMLCanvasElement>(null)
    let chart:any = null
    useEffect(() => {
        loadJs.then(() => {
            options ??= {
                responsive: true,
                legend: {
                    position: "top"
                }
            }
            if (chart) {
                chart.destroy()
                chart = null
            }
            chart = new Chart(canvas.current, {
                type: type || "bar",
                data: data,
                options,
            })
        })
    }, [])

    return <div><canvas ref={canvas}></canvas></div>
}