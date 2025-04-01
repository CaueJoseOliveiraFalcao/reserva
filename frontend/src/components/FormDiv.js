

export default function FormDiv({children}){
    return (
        <div className='min-h-screen w-full justify-center  bg-amber-900 flex-col'>
            <img width='200px' className="m-auto" src="/logo_transparente.png"/>
            <div className='w-full flex justify-center items-center'>
                {children}
            </div>
        </div>
    )
}