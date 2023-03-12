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
            className="px-8 m-2 btn btn-active btn-primary gap-2"
            onClick={onClick}>
            <img src='raydium.svg' className='btn-img-text-large'></img> Swap
        </button>
    );
};

