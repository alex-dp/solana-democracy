import { FC } from 'react';
import Link from "next/link";
import Text from './Text';
import NavElement from './nav-element';
interface Props {
  children: React.ReactNode;
}

export const ContentContainer: React.FC<Props> = ({ children }) => {

  return (
    <div className="flex-1 drawer h-52">
      <input id="my-drawer" type="checkbox" className="grow drawer-toggle" />
      <div className="items-center  drawer-content">
        {children}
      </div>
      {/* SideBar / Drawer */}
      <div className="drawer-side h-full">
        <label htmlFor="my-drawer" className="drawer-overlay gap-6"></label>

        <ul className="p-4 overflow-y-auto menu w-80 bg-base-100 gap-10 sm:flex items-center">
          <li>
            <img className="h-12" src='/argontype.svg'/>
          </li>
          <li>
            <NavElement
              label="Home"
              href="/"
            />
          </li>
          <li>
            <NavElement
              label="UBI"
              href="/ubi"
            />
          </li>
          <li>
            <NavElement
              label="Petitions"
              href="/petitions"
            />
          </li>
          <li>
            <NavElement
              label="Mirrors"
              href="/mirrors"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};
