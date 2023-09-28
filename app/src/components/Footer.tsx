import Link from 'next/link';
import { FC } from 'react';
export const Footer: FC = () => {
    return (
        <footer className="flex flex-row place-content-start fixed bottom-0 bg-transparent w-screen z-50 m-4">
            <Link href="https://github.com/alex-dp/solana-democracy" target='_blank'>
                <img alt="Static Badge" src="https://img.shields.io/badge/source_code-8321C5?style=for-the-badge&logo=github&label=github&cacheSeconds=10000000000" />
            </Link>
        </footer>
    );
};
