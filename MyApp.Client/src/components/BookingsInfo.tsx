import { apiUrl } from "@/gateway"
export default () => {
    return (
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
        </div>)
}