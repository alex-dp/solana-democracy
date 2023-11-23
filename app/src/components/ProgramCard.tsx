import Link from "next/link"

type CardProps = {
    title: string,
    description: string,
    destination: string,
    disabled: boolean,
    pid?: string
}

export const ProgramCard = (props: CardProps) => {
    let { title, description, destination, disabled, pid } = props
    return (
        <div className="card rounded-2xl border-2 border-purple-500 w-72 m-4 bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex flex-row place-content-between">
                    <h2 className="card-title">{title}</h2>
                    {
                        pid &&
                        <div className="tooltip" data-tip="View program in explorer">
                            <Link href={"https://explorer.solana.com/address/" + pid}>
                                <button className="btn btn-xs btn-circle btn-outline lowercase">i</button>
                            </Link>
                        </div>
                    }
                </div>
                <p>{description}</p>
                <Link href={destination} onClick={(e) => { if (disabled) e.preventDefault() }}>
                    <div className="card-actions justify-end">
                        <button className="btn gap-2 mt-4" disabled={disabled}>
                            {disabled ? "Coming Soon" : "Launch"}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48">
                                <path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" />
                            </svg>
                        </button>
                    </div>
                </Link>
            </div>
        </div>
    )
}