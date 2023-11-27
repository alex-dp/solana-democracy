import { FC, useCallback } from 'react';

export const Swap: FC = () => {

    const onClick = useCallback(async () => {
        window.open(
            'https://jup.ag/swap/ARGON_4HgYp2eiokKcqe5AVAxpwCsfUE5pwCNTiPXvpSxYnDi6-SOL',
            '_blank'
        );
    }, []);

    return (
        <button
            className="px-4 m-2 btn bg-gradient-to-r from-[#fbc00b] to-[#4eb9e7] gap-4 text-black"
            onClick={onClick}>
            <img src='jupiter.svg' className='w-6 h-6'></img> Swap
        </button>
    );
};