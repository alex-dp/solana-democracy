import Link from 'next/link';

export const MirrorsView = () => {

    return (

        <div className='md:hero mx-auto p-4 apply-gradient'>
            <div className="hero-content flex flex-col place-content-center">

                <p className="pt-8 pb-4 mx-auto">
                    <img src='argonmir.svg' className='h-16' />
                </p>

                <div className="flex flex-col gap-4">

                    <Link href={`https://argonsuite.vercel.app`} className='mx-auto'>
                        <button className="btn btn-active btn-primary">
                            vercel
                            <div className="badge">argonsuite.org</div>
                        </button>
                    </Link>

                    <Link href={`https://argonsuite.on.fleek.co/`} className='mx-auto'>
                        <button className="btn btn-active btn-primary">
                            ipfs
                        </button>
                    </Link>


                </div>

            </div>
        </div >

    );
};