import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
export const Footer: FC = () => {
    return (
        <div className="relative">
            <footer className="border-t-2 border-[#141414] bg-black hover:text-white absolute w-full" >
                <div className="ml-12 py-12 mr-12">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-8 md:space-x-12 relative">
                        <div className='flex flex-col col-span-2 mx-4 items-center md:items-start'>
                            Solana Democracy Suite
                        </div>

                        <div className="mb-6 items-center mx-auto max-w-screen-lg">
                            <a href="https://github.com/alex-dp/solana-ubi" className='underline'>UBI Program</a>
                        </div>

                        <div className="mb-6 items-center mx-auto max-w-screen-lg">
                            <a href="https://github.com/alex-dp/solana-democracy" className='underline'>Frontend and petition program</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
