import React, { useState, useEffect } from "react"
import LayoutPage from "@/components/LayoutPage"
import SrcPage from "@/components/SrcPage"
import { useClient } from "@/gateway"
import { GetWeatherForecast, Forecast } from "@/dtos"
import { columnDefs, DataTable, getCoreRowModel } from "@/components/DataTable"
import { CellContext } from "@tanstack/react-table"

export default (): React.JSX.Element => {
    const client = useClient()
    const [forecasts, setForecasts] = useState<Forecast[]>([])

    useEffect(() => {
        (async () => {
            const api = await client.api(new GetWeatherForecast())
            if (api.succeeded) {
                setForecasts(api.response!)
            }
        })()
    }, [])

    const columns = columnDefs<Forecast>(['date', 'temperatureC', 'temperatureF', 'summary'],
        ({ temperatureC, temperatureF }) => {
            temperatureC.header = "Temp. (C)"
            temperatureF.header = "Temp. (F)"

            // Properly type the cell renderer function
            const tempCellRenderer = ({ getValue }: CellContext<Forecast, number>) => (
                <>{getValue()}&deg;</>
            )

            temperatureC.cell = tempCellRenderer
            temperatureF.cell = tempCellRenderer
        })

    return (
        <LayoutPage title="Weather">
            <DataTable
                columns={columns}
                data={forecasts}
                getCoreRowModel={getCoreRowModel()}
            />
            <div className="mt-8 flex justify-center gap-x-4">
                <SrcPage path="weather.tsx" />
            </div>
        </LayoutPage>
    )
}