export default () => {
    return (
        <footer className="bg-accent-1 border-t border-accent-2">

            <nav className="pt-8 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
                <div className="pb-6">
                    <a href="/about" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50">About</a>
                </div>
                <div className="pb-6">
                    <a href="/features" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50">Features</a>
                </div>
                <div className="pb-6">
                    <a href="/deploy" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50">Deploy</a>
                </div>
                <div className="pb-6">
                    <a href="/posts" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50">Archive</a>
                </div>
                <div className="pb-6">
                    <a href="/privacy" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50">Privacy</a>
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
                        <a href={`https://github.com/NetCoreTemplates/react-spa`}
                           className="mx-3 font-bold hover:underline">
                            View on GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
