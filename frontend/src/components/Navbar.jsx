// import { useState, useRef, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// function Header({ user }) {
//     const [showMenu, setShowMenu] = useState(false);
//     const menuRef = useRef();
//     console.log(user)
//     // Close dropdown on outside click
//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (menuRef.current && !menuRef.current.contains(event.target)) {
//                 setShowMenu(false);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);




//     const sendWhatsappMsg = async () => {
//         alert("Do not change this message, it is used to link your WhatsApp with the app . By clicking Ok you agree to our terms and conditions.");
//         const message = `secret code: ${user.id}`;
//         window.open(
//             `https://wa.me/905488274659?text=${encodeURIComponent(message)}`,
//             "_blank"
//         );
//     }

//     return (
//         <header className="mb-8 px-4">
//             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//                 {/* Logo Section */}
//                 <div className="flex items-center gap-2">
//                     <div className="bg-indigo-600 text-white p-2 rounded-lg">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                         </svg>
//                     </div>
//                     <h1 className="text-2xl font-bold text-gray-800">
//                         Task AI <span className="text-indigo-600">Studio</span>
//                     </h1>
//                 </div>

//                 {/* Right Section */}
//                 <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto relative">
//                     {/* WhatsApp Button - Only icon now */}
//                     <button
//                         onClick={sendWhatsappMsg}
//                         className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
//                     >
//                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 32 32">
//                             <path d="M16 0C7.164 0 0 6.99 0 15.615c0 2.757.763 5.34 2.073 7.591L0 32l8.005-2.094A15.964 15.964 0 0016 31.23c8.836 0 16-6.99 16-15.615C32 6.99 24.836 0 16 0zm0 28.615c-2.545 0-4.946-.688-7.01-1.896l-.502-.296-4.755 1.244 1.266-4.63-.327-.475a12.892 12.892 0 01-2.045-7.047c0-7.13 5.943-12.93 13.333-12.93S29.333 8.486 29.333 15.615 23.39 28.615 16 28.615z" />
//                         </svg>
//                     </button>

//                     {/* User Info with Dropdown */}
//                     <div className="relative" ref={menuRef}>
//                         <button
//                             onClick={() => setShowMenu(!showMenu)}
//                             className="flex items-center gap-2 focus:outline-none"
//                         >
//                             <div className="hidden sm:flex w-10 h-10 bg-indigo-600 rounded-full items-center justify-center text-white font-semibold shadow-md">
//                                 {user.name[0]}
//                             </div>
//                             {/* <span className="text-sm font-medium text-gray-700 hidden sm:inline">
//                                 {user.name}
//                             </span> */}
//                             <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                             </svg>
//                         </button>

//                         {/* Dropdown Menu */}
//                         {showMenu && (
//                             <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">

//                                 <Link to={'/profile'} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" >View Profile</Link>

//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </header>
//     );
// }

// export default Header;

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Header({ user }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const menuRef = useRef();
    const mobileMenuRef = useRef();

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setShowMobileMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const sendWhatsappMsg = async () => {
        alert("Do not change this message, it is used to link your WhatsApp with the app . By clicking Ok you agree to our terms and conditions.");
        const message = `secret code: ${user.id}`;
        window.open(
            `https://wa.me/905488274659?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    }

    return (
        <header className="mb-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 transition-colors duration-200">
            <div className="flex justify-between items-center py-4">
                {/* Logo Section */}
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Task AI <span className="text-indigo-600 dark:text-indigo-400">Studio</span>
                    </h1>
                </div>

                {/* Desktop Right Section */}
                <div className="hidden sm:flex items-center gap-3 relative">
                    {/* Theme Toggle */}
                    <ThemeToggle />
                    {/* WhatsApp Button */}
                    <button
                        onClick={sendWhatsappMsg}
                        className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
                        title="Connect WhatsApp"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 32 32">
                            <path d="M16 0C7.164 0 0 6.99 0 15.615c0 2.757.763 5.34 2.073 7.591L0 32l8.005-2.094A15.964 15.964 0 0016 31.23c8.836 0 16-6.99 16-15.615C32 6.99 24.836 0 16 0zm0 28.615c-2.545 0-4.946-.688-7.01-1.896l-.502-.296-4.755 1.244 1.266-4.63-.327-.475a12.892 12.892 0 01-2.045-7.047c0-7.13 5.943-12.93 13.333-12.93S29.333 8.486 29.333 15.615 23.39 28.615 16 28.615z" />
                        </svg>
                    </button>

                    {/* User Info with Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center gap-2 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors duration-200"
                        >
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                {user.name[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-24 truncate">
                                {user.name}
                            </span>
                            <svg className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Desktop Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email || 'User'}</p>
                                </div>
                                <Link 
                                    to={'/profile'} 
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    View Profile
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="sm:hidden relative" ref={mobileMenuRef}>
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Mobile Dropdown Menu */}
                    {showMobileMenu && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                            {/* User Info Section */}
                            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                        {user.name[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email || 'User'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                                <Link 
                                    to={'/profile'} 
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    View Profile
                                </Link>
                                
                                <button
                                    onClick={() => {
                                        sendWhatsappMsg();
                                        setShowMobileMenu(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 w-full text-left"
                                >
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 32 32">
                                        <path d="M16 0C7.164 0 0 6.99 0 15.615c0 2.757.763 5.34 2.073 7.591L0 32l8.005-2.094A15.964 15.964 0 0016 31.23c8.836 0 16-6.99 16-15.615C32 6.99 24.836 0 16 0zm0 28.615c-2.545 0-4.946-.688-7.01-1.896l-.502-.296-4.755 1.244 1.266-4.63-.327-.475a12.892 12.892 0 01-2.045-7.047c0-7.13 5.943-12.93 13.333-12.93S29.333 8.486 29.333 15.615 23.39 28.615 16 28.615z" />
                                    </svg>
                                    Connect WhatsApp
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;