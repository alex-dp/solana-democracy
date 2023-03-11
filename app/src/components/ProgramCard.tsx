import Link from "next/link"

type CardProps = {
    title: string,
    description: string,
    destination: string,
    button: string,
    disabled: boolean
}

export const ProgramCard = ({ title, description, destination, button, disabled }: CardProps) => {
    return (
        <div className="card rounded-2xl border-2 border-purple-500 w-72 m-6 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
                <Link href={destination}>
                    <div className="card-actions justify-end">
                        <button className="btn gap-2" disabled={disabled}>
                            {button}
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