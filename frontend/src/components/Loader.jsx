import React, { useEffect } from "react";

const LoaderScreen = ({ status, errorMessage, onClose,successMessage }) => {
    useEffect(() => {
        let timer;

        if (status === "success") {
            timer = setTimeout(() => {
                onClose();
            }, 3000);
        } else if (status === "error") {
            timer = setTimeout(() => {
                onClose();
            }, 5000);
        }

        return () => clearTimeout(timer);
    }, [status, onClose]);

    if (status === "idle") return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center transition-colors duration-200">
                {status === "loading" ? (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Loading...</p>
                    </div>
                ) : status === "success" ? (
                    <div className="text-green-600 space-y-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-xl font-bold">Success!</p>
                        <p>{successMessage}</p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <div className="text-red-600 space-y-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p className="text-xl font-bold">Error</p>
                        {errorMessage && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">{errorMessage}</p>
                        )}
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoaderScreen;
