import Link from 'next/link';
import NavElement from './nav-element';
interface Props {
  children: React.ReactNode;
}

export const ContentContainer: React.FC<Props> = ({ children }) => {

  return (
    <div className="flex-1 drawer h-52">
      <input id="my-drawer" type="checkbox" className="grow drawer-toggle" />
      <div className="items-center drawer-content">
        {children}
      </div>
      {/* SideBar / Drawer */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay gap-6"></label>

        <ul className="overflow-auto menu w-80 min-h-full border-r-2 border-white bg-base-100 gap-10 sm:flex items-center">
          <li>
            <img className="h-12 mt-12" src='/argontype.svg' />
          </li>
          <li className='w-full'>
            <NavElement
              label="Home"
              href="/"
            />
          </li>
          <li className='w-full'>
            <NavElement
              label="UBI"
              href="/ubi"
            />
          </li>
          <li className='w-full'>
            <NavElement
              label="Petitions"
              href="/petitions"
            />
          </li>
          <li className='w-full'>
            <NavElement
              label="Mirrors"
              href="/mirrors"
            />
          </li>
          <li>
            <Link href="https://github.com/alex-dp/solana-democracy" target='_blank'>
              <img alt="Static Badge" src="https://img.shields.io/badge/source_code-8321C5?style=for-the-badge&logo=github&label=github&cacheSeconds=10000000000" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
