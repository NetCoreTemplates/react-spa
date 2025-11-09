import Page from "@/components/LayoutPage"
import { ValidateAuth } from "@/auth.tsx"

import SrcPage from "@/components/SrcPage"
import { AutoQueryGrid } from "@servicestack/react"
import BookingsInfo from "@/components/BookingsInfo.tsx"
import { Link } from "react-router-dom"

function Index() {


    return (<Page title="Bookings CRUD (Auto)" className="max-w-screen-lg">

        <div className="mb-4 flex justify-end">
            <Link to="/bookings-custom" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                View Custom Bookings →
            </Link>
        </div>

        <div className="mt-4 flex flex-col ">
            <AutoQueryGrid type="Booking"/>

            <div className="mt-4 text-center text-gray-400 flex justify-center -ml-6">
                <SrcPage path="bookings-crud/index.tsx"/>
            </div>
        </div>

        <BookingsInfo/>

    </Page>)
}

export default ValidateAuth(Index, {role: 'Employee'})

