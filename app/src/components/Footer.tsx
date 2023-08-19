import Link from 'next/link';
import { FC } from 'react';
export const Footer: FC = () => {
    return (
        <footer className="flex flex-row place-content-start fixed bottom-0 bg-transparent w-screen z-50">
            <Link href="https://github.com/alex-dp/solana-democracy" target='_blank'>
                <button className='btn m-2 gap-2'>
                    source
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.25 42.7q-1.6 0-2.775-1.175Q5.3 40.35 5.3 38.75V9.25q0-1.65 1.175-2.825Q7.65 5.25 9.25 5.25h13.7v4H9.25v29.5h29.5v-13.7h4v13.7q0 1.6-1.175 2.775Q40.4 42.7 38.75 42.7Zm10.5-11.65L17 28.25l19-19H25.95v-4h16.8v16.8h-4v-10Z" />
                    </svg>
                </button>
            </Link>
        </footer>
    );
};
