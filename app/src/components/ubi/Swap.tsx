import { FC, useCallback } from 'react';

export const Swap: FC = () => {

    const onClick = useCallback(async () => {
        window.open(
            'https://raydium.io/swap?inputCurrency=4HgYp2eiokKcqe5AVAxpwCsfUE5pwCNTiPXvpSxYnDi6&outputCurrency=sol&inputAmount=0&fixed=in',
            '_blank'
        );
    }, []);

    return (
        <button
            className="px-8 m-2 btn bg-gradient-to-r from-[#5ac4beff] via-[#3773feff] to-[#c200fbff] hover:from-[#303030] hover:to-[#303030] max-width-200 width-20 ..."
            onClick={onClick}>
            <img src='raydium.svg' className='btn-img-text-large'></img> &nbsp; Swap
        </button>
    );
};

