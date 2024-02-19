import { ConfirmDelete, ErrorSummary, SelectInput, TextAreaInput, TextInput } from "@/components/Form"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Booking, DeleteBooking, QueryBookings, RoomType, UpdateBooking } from "@/dtos"
import { Button } from "@/components/ui/button"
import { useApp, useClient } from "@/gateway"
import { useState, useEffect, FormEvent, ChangeEvent } from "react"
import { ApiContext } from "@/components/Form"
import { useAuth } from "@/useAuth"
import { sanitizeForUi } from "@/utils"
import SrcPage from "@/components/SrcPage.tsx";

type Props = {
    id?: number
    onDone: () => void
    onSave: () => void
}
export default ({ id, onDone, onSave }: Props) => {

    const client = useClient()
    const { loading } = client
    const { hasRole } = useAuth()
    const visibleFields = "name,roomType,roomNumber,bookingStartDate,bookingEndDate,cost,notes"

    const [editBooking, setEditBooking] = useState<Booking | null>(null)

    const app = useApp()

    const [request, setRequest] = useState(new UpdateBooking())

    useEffect(() => {
        (async () => {
            if (id) {
                const api = await client.api(new QueryBookings({id}))
                const booking = api.response ? api.response.results[0] : null
                setEditBooking(booking)
                if (booking) setRequest(new UpdateBooking(sanitizeForUi({... booking })))
            } else {
                setEditBooking(null)
            }
        })()
    }, [id]);

    async function onSubmit(e:FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await save()
    }
    async function save() {
        const api = await client.api(request)
        if (api.succeeded) (onSave ?? onDone)()
    }
    async function onDelete() {
        const api = await client.apiVoid(new DeleteBooking({id}))
        if (api.succeeded) (onSave ?? onDone)()
    }
    function change(f: (dto: UpdateBooking, value: string) => void) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            f(request, e.target.value)
            setRequest(new UpdateBooking(request))
        }
    }

    return (<ApiContext.Provider value={client}>
        <Sheet open={editBooking != null} onOpenChange={onDone}>
            <SheetContent className="w-screen xl:max-w-3xl md:max-w-xl max-w-lg">
                <SheetHeader>
                    <SheetTitle>Edit Booking</SheetTitle>
                </SheetHeader>
                {!editBooking ? null :
                    <form className="grid gap-4 py-4" onSubmit={onSubmit}>
                        <input className="hidden" type="submit"/>
                        <fieldset disabled={loading}>
                            <ErrorSummary except={visibleFields} className="mb-4"/>
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <TextInput id="name" required placeholder="Name for this booking"
                                               defaultValue={request.name}
                                               onChange={change((x, value) => x.name = value)}/>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <SelectInput id="roomType" options={app.enumOptions('RoomType')}
                                                 value={request.roomType}
                                                 onChange={change((x, value) => x.roomType = value as RoomType)}/>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <TextInput type="number" id="roomNumber" min="0" required
                                               defaultValue={request.roomNumber}
                                               onChange={change((x, value) => x.roomNumber = Number(value))}/>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <TextInput type="number" id="cost" min="0" required
                                               defaultValue={request.cost}
                                               onChange={change((x, value) => x.cost = Number(value))}/>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <TextInput type="date" id="bookingStartDate" required
                                               defaultValue={request.bookingStartDate}
                                               onChange={change((x, value) => x.bookingStartDate = value)}/>
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <TextInput type="date" id="bookingEndDate"
                                               defaultValue={request.bookingEndDate}
                                               onChange={change((x, value) => x.bookingEndDate = value)}/>
                                </div>
                                <div className="col-span-6">
                                    <TextAreaInput id="notes" placeholder="Notes about this booking"
                                                   style={{height: '6rem'}}
                                                   defaultValue={request.notes}
                                                   onChange={change((x, value) => x.notes = value)}/>
                                </div>
                            </div>
                        </fieldset>
                        <div className="flex justify-center">
                            <SrcPage path="bookings-crud/Edit.tsx" />
                        </div>
                    </form>}
                <SheetFooter>
                    <div
                        className="w-full absolute bottom-0 left-0 border-gray-200 dark:border-gray-700 border-t mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 sm:px-6 flex flex-wrap justify-between">
                        <div>
                            {!hasRole('Manager') ? null :
                                <ConfirmDelete onDelete={onDelete}>Delete</ConfirmDelete>}
                        </div>
                        <div></div>
                        <div className="flex justify-end">
                            <Button variant="outline" onClick={onDone}>Cancel</Button>
                            <Button type="submit" className="ml-4" disabled={loading} onClick={save}>Save</Button>
                        </div>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    </ApiContext.Provider>)
}