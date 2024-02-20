import { useEffect, useState } from "react"
import Page from "@/components/LayoutPage"
import { ValidateAuth } from "@/useAuth"

import Create from "./Create"
import Edit from "./Edit"
import { Booking, QueryBookings } from "@/dtos"
import { useClient, apiUrl } from "@/gateway"
import { formatCurrency, formatDate } from "@/utils"
import { DataTable, columnDefs, getCoreRowModel } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import SrcPage from "@/components/SrcPage"

function Index() {

    const client = useClient()
    const [newBooking, setNewBooking] = useState<boolean>(false)
    const [bookings, setBookings] = useState<Booking[]>([])
    useEffect(() => {
        (async () => await refreshBookings())()
    }, [])

    const columns = columnDefs(['id', 'name', 'roomType', 'roomNumber', 'cost', 'bookingStartDate', 'createdBy'], 
        ({ cost , bookingStartDate}) => {
            cost.cell = ({ getValue }) => <>{formatCurrency(getValue() as number)}</>
            
            bookingStartDate.header = 'Start Date'
            bookingStartDate.cell = ({ getValue }) => <>{formatDate(getValue() as string)}</>
        })
    
    const reset = (args: { newBooking?: boolean, editBookingId?: number } = {}) => {
        setNewBooking(args.newBooking ?? false)
        setRowSelection({})
    }

    const onDone = async () => reset()
    const onSave = async () => {
        onDone()
        await refreshBookings()
    }

    const refreshBookings = async () => {
        const api = await client.api(new QueryBookings())
        if (api.succeeded) {
            setBookings(api.response!.results ?? [])
        }
    }
    const [rowSelection, setRowSelection] = useState({})
    const selectedIndex = parseInt(Object.keys(rowSelection)[0])
    const selectedRow = !isNaN(selectedIndex)
        ? bookings[selectedIndex]
        : null

    return (<Page title="Bookings CRUD">
        {bookings.length == 0 ? null : (
            <div className="mt-4 flex flex-col">
                <div className="my-2">
                    <Button variant="outline" onClick={() => setNewBooking(true)}>New Booking</Button>
                </div>
                <DataTable columns={columns} data={bookings} getCoreRowModel={getCoreRowModel()} state={{rowSelection}}
                           enableRowSelection={true} enableMultiRowSelection={false}
                           onRowSelectionChange={setRowSelection}/>

                <Create open={newBooking} onDone={onDone} onSave={onSave} />
                <Edit id={selectedRow?.id} onDone={onDone} onSave={onSave} />

                <div className="mt-4 text-center text-gray-400 flex justify-center -ml-6">
                    <SrcPage path="bookings-crud/index.tsx"/>
                </div>
            </div>)}

        <div className="pb-20">
            <h4 className="mt-20 text-center text-xl">
                Manage Bookings in
                <a className="font-semibold" href={apiUrl('/locode/QueryBookings')}> Locode </a> or
                <a className="font-semibold" href={apiUrl('/ui/QueryBookings')}> API Explorer </a>
            </h4>
            <div className="mt-20 mx-auto text-gray-500 max-w-screen-lg">
                <h2 className="mt-4 text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight dark:text-slate-50">
                    Create a multi-user Booking system in minutes
                </h2>
                <p className="my-3 mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
                    The Bookings APIs are built using
                    <a className="font-semibold" href="https://docs.servicestack.net/autoquery-crud"> AutoQuery CRUD</a>,
                    allowing for rapid development of typed CRUD Services using only declarative POCO DTOs, enabling
                    developing entire
                    <a className="font-semibold" href="https://docs.servicestack.net/autoquery/crud#advanced-crud-example"> audited </a>
                    &amp; <a className="font-semibold" href="https://docs.servicestack.net/autoquery/audit-log"> verifiable </a>
                    data-driven systems in mins
                    <a className="font-semibold" href="https://docs.servicestack.net/autoquery/bookings-crud"> more...</a>
                </p>
                <iframe className="mt-4 w-full aspect-video" src="https://www.youtube.com/embed/rSFiikDjGos" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            </div>
        </div>
        
    </Page>)
}

export default ValidateAuth(Index, { role: 'Employee' })
