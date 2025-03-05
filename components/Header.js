import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const [authToken, setAuthToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthToken(localStorage.getItem("auth_token"));
    }
  }, []);

  return (
    <header className="sticky top-0 z-10 max-w-3xl mx-auto p-4 bg-white">
      <nav className="bg-white">
        <div className="flex flex-wrap items-center justify-between mx-auto">
          <div className="flex gap-1 items-center">
            <Link href="/"><img src="/images/spotlight_logo.png" alt="spotlight_logo" className="w-28" /></Link>
          </div>

          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg sm:hidden"
            aria-controls="navbar-default"
            aria-expanded={isOpen ? "true" : "false"}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={`absolute left-0 top-full w-full sm:w-auto sm:static bg-white py-6 px-4 sm:px-0 sm:py-0 border-b sm:border-0 border-gray transition-all duration-300 ease-in-out transform ${
              isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-5 invisible sm:opacity-100  sm:translate-y-0 sm:visible"
            }`}
            id="navbar-default"
          >
            <ul className="flex flex-col items-start sm:items-center sm:flex-row text-secondary">
              <li className="pr-4"> Explore </li>
              {authToken ? 
                <li>
                  <Link href="/admin" className="block flex py-2 sm:py-0 sm:pl-3 font-bold">
                    <img src="/images/profile_icon.svg" alt="profile icon" />
                  </Link>
                </li>
              :
                <li>
                  <Link href="/login" className="block flex py-2 sm:py-0 sm:pl-3 font-bold">
                    Login
                    <img src="/images/right_arrow_2.svg" alt="login_icon" className="ml-1 w-4" />
                  </Link>
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
