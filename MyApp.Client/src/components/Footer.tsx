import { NavLink } from "react-router-dom"

export default () => {

    const navClass = ({isActive}: any) => [
        "text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50",
        isActive ? "font-bold" : "",
    ].join(" ")

    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">

            <nav className="pt-8 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
                <div className="pb-6">
                    <NavLink to="/about" className={navClass}>About</NavLink>
                </div>
                <div className="pb-6">
                    <NavLink to="/deploy" className={navClass}>Deploy</NavLink>
                </div>
                <div className="pb-6">
                    <NavLink to="/posts" className={navClass}>Archive</NavLink>
                </div>
                <div className="pb-6">
                    <NavLink to="/privacy" className={navClass}>Privacy</NavLink>
                </div>
            </nav>

            <div className="container mx-auto px-5">
                <div className="py-28 flex flex-col lg:flex-row items-center">
                    <h3 className="text-4xl lg:text-6xl font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
                        A ServiceStack Project
                    </h3>
                    <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
                        <a href="https://docs.servicestack.net"
                           className="mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0">
                            Read Documentation
                        </a>
                        <a href="https://github.com/NetCoreTemplates/react-spa"
                           className="mx-3 font-bold hover:underline">
                            View on GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
