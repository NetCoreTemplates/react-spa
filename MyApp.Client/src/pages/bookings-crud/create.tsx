import { ErrorSummary, SelectInput, TextAreaInput, TextInput } from "@/components/Form"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { CreateBooking, RoomType } from "@/dtos"
import { Button } from "@/components/ui/button.tsx";
import { useApp, useClient } from "@/gateway.ts";
import { useState, FormEvent, ChangeEvent } from "react"
import { ApiContext } from "@/components/Form"
import { dateInputFormat } from "@/utils"
import SrcPage from "@/components/SrcPage.tsx";

type Props = {
    open: boolean
    onDone: () => void
    onSave?: () => void
}

export default ({open, onDone, onSave}: Props) => {
    const visibleFields = "name,roomType,roomNumber,bookingStartDate,bookingEndDate,cost,notes"

    const app = useApp()
    const client = useClient()
    const { loading, clearErrors } = client

    const newBooking = () => new CreateBooking({
        roomType: RoomType.Single,
        roomNumber: 0,
        cost: 0,
        bookingStartDate: dateInputFormat(new Date())
    })
    const [request, setRequest] = useState(newBooking())

    function close() {
        setRequest(newBooking())
        clearErrors()
        onDone()
    }
    async function onSubmit(e:FormEvent<HTMLFormElement>) {
        e.preventDefault()
        await save()
    }
    async function save() {
        const api = await client.api(request)
        if (api.succeeded) {
            setRequest(newBooking());
            (onSave ?? onDone)()
        }
    }
    function change(f: (dto: CreateBooking, value: string) => void) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            f(request, e.target.value)
            setRequest(new CreateBooking(request))
        }
    }

    return (<ApiContext.Provider value={client}>
        <Sheet open={open} onOpenChange={close}>
            <SheetContent className="w-screen xl:max-w-3xl md:max-w-xl max-w-lg">
                <SheetHeader>
                    <SheetTitle>New Booking</SheetTitle>
                </SheetHeader>
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
                        <SrcPage path="bookings-crud/Create.tsx"/>
                    </div>
                </form>
                <SheetFooter>
                    <div
                        className="w-full absolute bottom-0 left-0 border-gray-200 dark:border-gray-700 border-t mt-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 sm:px-6 flex flex-wrap justify-between">
                        <div>
                        </div>
                        <div></div>
                        <div className="flex justify-end">
                            <Button variant="outline" onClick={close}>Cancel</Button>
                            <Button className="ml-4" disabled={loading} onClick={save}>Save</Button>
                        </div>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    </ApiContext.Provider>)
}
