import { Link, NavLink } from "react-router-dom"
import Logo from "@/assets/img/logo.svg?react"
import DarkModeToggle from "@/components/DarkModeToggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/useAuth"

export default () => {
    const {auth, signout} = useAuth()

    const navClass = ({isActive}: any) => [
        "p-4 flex items-center justify-start mw-full hover:text-sky-500 dark:hover:text-sky-400",
        isActive ? "text-link-dark dark:text-link-dark" : "",
    ].join(" ")

    return (<header className="border-b border-gray-200 dark:border-gray-800 pr-3">
        <div className="flex flex-wrap items-center">
            <div className="absolute z-10 top-2 left-2 sm:static flex-shrink flex-grow-0">
                <div className="cursor-pointer">
                    <Link to="/" className="navbar-brand flex items-center">
                        <Logo className="w-8 h-8 sm:ml-2 sm:w-12 sm:h-12" title="MyApp logo"/>
                        <span className="hidden ml-2 sm:block text-2xl font-semibold">My App</span>
                    </Link>
                </div>
            </div>
            <div className="flex flex-grow flex-shrink flex-nowrap justify-end items-center">
                <nav className="relative flex flex-grow leading-6 font-semibold text-slate-700 dark:text-slate-200">
                    <ul className="flex flex-wrap items-center justify-end w-full m-0">
                        <li className="relative flex flex-wrap just-fu-start m-0">
                            <NavLink to="/counter" className={navClass}>Counter</NavLink>
                        </li>
                        <li className="relative flex flex-wrap just-fu-start m-0">
                            <NavLink to="/weather" className={navClass}>Weather</NavLink>
                        </li>
                        <li className="relative flex flex-wrap just-fu-start m-0">
                            <NavLink to="/todomvc" className={navClass}>Todos</NavLink>
                        </li>
                        <li className="relative flex flex-wrap just-fu-start m-0">
                            <NavLink to="/bookings-crud" className={navClass}>Bookings</NavLink>
                        </li>
                        <li className="relative flex flex-wrap just-fu-start m-0">
                            <NavLink to="/whatsnew" className={navClass}>What's New</NavLink>
                        </li>
                        <li className="relative flex flex-wrap just-fu-start m-0">
                            <NavLink to="/blog" className={navClass}>Blog</NavLink>
                        </li>
                        <li className="relative flex flex-wrap just-fu-start m-0">
                            <NavLink to="/videos" className={navClass}>Videos</NavLink>
                        </li>
                        {auth
                            ? (<>
                                <li>
                                    <div className="mx-3 relative">
                                        <div>
                                            <Link to="/profile"
                                                  className="max-w-xs bg-white dark:bg-black rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50 dark:lg:hover:bg-gray-900 dark:ring-offset-black"
                                                  id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                                <img className="h-8 w-8 rounded-full" src={auth.profileUrl} alt=""/>
                                                <span
                                                    className="hidden ml-3 text-gray-700 dark:text-gray-300 text-sm font-medium lg:block">
                                                <span className="sr-only">Open user menu for </span>
                                                    {auth.userName}
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                                <li className="mr-3 relative flex flex-wrap just-fu-start m-0">
                                    <Button variant="outline" onClick={() => signout()}>
                                        Sign Out
                                    </Button>
                                </li>
                            </>)
                            : (<li className="relative flex flex-wrap just-fu-start m-0">
                                <Button variant="outline" className="m-2" asChild>
                                    <Link to="/signin">Sign In</Link>
                                </Button>
                            </li>)
                        }
                        <li className="relative flex flex-wrap just-fu-start m-0">
                            <DarkModeToggle/>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>)
}
