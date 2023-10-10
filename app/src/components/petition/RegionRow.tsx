import Link from "next/link";

type RowProps = {
    description: String,
    code: number
};

const RegionRow = ({
    description, code
}: RowProps) => {

    return (
        <div className="flex flex-row gap-6 place-content-center">
            <div className="uppercase font-bold">{description}</div>
            <Link href={"/petitions/" + code.toString()}>
                <button className="btn btn-active btn-primary gap-2">
                    Explore
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" /></svg>
                </button>
            </Link>
        </div>
    );
};

export default RegionRow;

