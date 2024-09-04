import { useSearchParams } from "react-router-dom"

export default () => {
    const [query, _] = useSearchParams()
    const message = query.get('message') ?? 'Unknown error'

    return (<>
        <div className="text-black bg-white h-screen text-center flex flex-col items-center justify-center">
            <div>
                <div className="inline-block text-left h-8 align-middle">
                    <h2 className="text-2xl text-red-700 leading-10 font-normal m-0 p-0">{message}</h2>
                </div>
            </div>
        </div>            
      </>
    )
}
