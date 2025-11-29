import React, { useState } from "react";
import { AutoQueryGrid, AutoEditForm, TextLink, Icon, PreviewFormat, useFormatters } from "@servicestack/react"
import Page from "@/components/LayoutPage"
import { ValidateAuth } from "@/lib/auth"
import SrcPage from "@/components/SrcPage"
import BookingsInfo from "@/components/BookingsInfo.tsx"
import { Link } from "react-router-dom"

function Index() {
    const { currency } = useFormatters()

    return (<Page title="Bookings CRUD (Custom Columns)" className="max-w-screen-lg">

        <div className="mb-4 flex justify-end">
            <Link to="/bookings-auto" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                ← View Auto Bookings
            </Link>
        </div>

        <div className="mt-4 flex flex-col ">
            <AutoQueryGrid
                type="Booking"
                selectedColumns={['id', 'name', 'cost', 'bookingStartDate', 'bookingEndDate', 'roomNumber', 'createdBy', 'discount']}
                visibleFrom={{
                    name: 'xl',
                    bookingStartDate: 'sm',
                    bookingEndDate: 'xl',
                    createdBy: '2xl'
                }}
                columnSlots={{
                    id: ({ id }: any) => (
                        <span className="text-gray-900" dangerouslySetInnerHTML={{ __html: id }} />
                    ),
                    name: ({ name }: any) => <>{name}</>,
                    cost: ({ cost }: any) => (
                        <span dangerouslySetInnerHTML={{ __html: currency(cost) }} />
                    ),
                    createdBy: ({ createdBy }: any) => (
                        <span dangerouslySetInnerHTML={{ __html: createdBy }} />
                    ),
                }}
                headerSlots={{
                    'roomNumber-header': () => (
                        <><span className="hidden lg:inline">Room </span>No</>
                    ),
                    'bookingStartDate-header': () => (
                        <>Start<span className="hidden lg:inline"> Date</span></>
                    ),
                    'bookingEndDate-header': () => (
                        <>End<span className="hidden lg:inline"> Date</span></>
                    ),
                    'createdBy-header': () => <>Employee</>
                }}
            />
            
            <div className="mt-4 text-center text-gray-400 flex justify-center -ml-6">
                <SrcPage path="bookings-custom.tsx"/>
            </div>
        </div>

        <BookingsInfo/>

    </Page>)
}

export default ValidateAuth(Index, {role: 'Employee'})

