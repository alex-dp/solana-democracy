import Link from 'next/link';
import { FC } from 'react';
export const Footer: FC = () => {
    return (
        <footer className="flex flex-row place-content-start fixed bottom-0 bg-transparent w-screen z-50">
            <Link href="https://github.com/alex-dp/solana-democracy" target='_blank'>
                <button className='btn m-2 gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6' fill='currentColor' viewBox="0 -960 960 960">
                        <path d="M570-160v-60h120q21 0 35.5-14.375T740-270v-100q0-37 22.5-66t57.5-40v-8q-35-10-57.5-39.5T740-590v-100q0-21.25-14.375-35.625T690-740H570v-60h120q46 0 78 32.083 32 32.084 32 77.917v100q0 21.25 14.375 35.625T850-540h30v120h-30q-21.25 0-35.625 14.375T800-370v100q0 45.833-32.083 77.917Q735.833-160 690-160H570Zm-300 0q-46 0-78-32.083-32-32.084-32-77.917v-100q0-21.25-14.375-35.625T110-420H80v-120h30q21.25 0 35.625-14.375T160-590v-100q0-45.833 32.083-77.917Q224.167-800 270-800h120v60H270q-21 0-35.5 14.375T220-690v100q0 37-22.5 66.5T140-484v8q35 11 57.5 40t22.5 66v100q0 21.25 14.375 35.625T270-220h120v60H270Z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6' fill="currentColor" viewBox="0 -960 960 960">
                        <path d="M320-242 80-482l242-242 43 43-199 199 197 197-43 43Zm318 2-43-43 199-199-197-197 43-43 240 240-242 242Z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.25 42.7q-1.6 0-2.775-1.175Q5.3 40.35 5.3 38.75V9.25q0-1.65 1.175-2.825Q7.65 5.25 9.25 5.25h13.7v4H9.25v29.5h29.5v-13.7h4v13.7q0 1.6-1.175 2.775Q40.4 42.7 38.75 42.7Zm10.5-11.65L17 28.25l19-19H25.95v-4h16.8v16.8h-4v-10Z" />
                    </svg>
                </button>
            </Link>
        </footer>
    );
};
