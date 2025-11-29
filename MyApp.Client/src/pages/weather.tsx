import React, { useState, useEffect } from "react"
import { useClient, DataGrid } from "@servicestack/react"
import LayoutPage from "@/components/LayoutPage"
import SrcPage from "@/components/SrcPage"
import { GetWeatherForecast, Forecast } from "@/lib/dtos"

export default (): React.JSX.Element => {
    const client = useClient()
    const [forecasts, setForecasts] = useState<Forecast[]>([])
    
    useEffect(() => {
        (async () => {
            const api = await client.api(new GetWeatherForecast())
            if (api.response) {
                setForecasts(api.response)
            }
        })()
    }, [])

    return (
        <LayoutPage title="Weather">
            <DataGrid
                items={forecasts}
                className="max-w-screen-md"
                tableStyle={['stripedRows', 'uppercaseHeadings']}
                headerTitles={{
                    temperatureC: 'TEMP. (C)',
                    temperatureF: 'TEMP. (F)'
                }}
                slots={{
                    'date-header': () => (
                        <span className="text-green-600">Date</span>
                    ),
                    'date': ({ date }: Forecast) => (
                        <>{date ? new Intl.DateTimeFormat().format(new Date(date)) : ''}</>
                    ),
                    'temperatureC': ({ temperatureC }: Forecast) => (
                        <>{temperatureC}&deg;</>
                    ),
                    'temperatureF': ({ temperatureF }: Forecast) => (
                        <>{temperatureF}&deg;</>
                    ),
                    'summary': ({ summary }: Forecast) => (
                        <>{summary}</>
                    )
                }}
            />

            <div className="mt-8 flex justify-center gap-x-4">
                <SrcPage path="weather.tsx" />
            </div>
        </LayoutPage>
    )
}