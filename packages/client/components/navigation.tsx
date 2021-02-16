import { FC, useState } from "react";
import { FaHamburger, FaTimes } from 'react-icons/fa';

const Navigation: FC = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  return <div className="bg-gray-900" id="navigation">
    <div className="mx-auto max-w-screen-lg px-5">
      <div className="flex flex-col md:flex-row">
        <div id="logo" className="py-4 relative">
          <h1 className="text-center leading-none font-bold md:text-lg text-white shadows-into-light transform -skew-y-6">Never Have<br />I Ever<small>.de</small></h1>
          <button className="md:hidden absolute right-0 top-0 h-full transition text-white p-2" onClick={() => setMenuVisible(!isMenuVisible)}>
            <div className="flex items-center justify-center absolute h-full w-full top-0 right-0">
              <FaHamburger className={`text-8xl transform transition ${isMenuVisible ? 'scale-100' : 'scale-0'}`} />
            </div>
            <div className="flex items-center justify-center absolute h-full w-full top-0 right-0">
              <FaTimes className={`text-8xl transform transition ${isMenuVisible ? 'scale-0' : 'scale-100'}`} />
            </div>
          </button>
        </div>
        <div className={`${isMenuVisible ? 'hidden' : ''} md:flex flex-grow justify-end text-white font-bold flex-col md:flex-row pb-5 md:py-5`}>
          <a href="#play-local" className="flex items-center justify-center md:justify-start p-3 md:py-0 md:px-5">Lokal spielen</a>
          <a href="#join-online-game" className="flex items-center justify-center md:justify-start p-3 md:py-0 md:px-5">Spiel beitreten</a>
          <a href="#create-online-game" className="flex items-center justify-center md:justify-start p-3 md:py-0 md:px-5">
            <span className="md:bg-purple-500 md:p-4 md:py-2 md:rounded-full">
              Spiel erstellen
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
}

export default Navigation;
