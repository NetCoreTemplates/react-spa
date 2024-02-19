import { useEffect, useState } from "react"
import Page from "@/components/LayoutPage"
import { ValidateAuth } from "@/useAuth"

import Create from "./Create"
import Edit from "./Edit"
import { Booking, QueryBookings } from "@/dtos"
import { useClient } from "@/gateway"
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
    </Page>)
}

export default ValidateAuth(Index, { role: 'Employee' })
