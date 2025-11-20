export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
            {/* Animated spinner */}
            <div className="relative">
                {/* Outer ring */}
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                {/* Spinning ring */}
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-black rounded-full animate-spin"></div>
            </div>

            {/* Loading text with pulse animation */}
            <p className="text-sm font-medium text-gray-600 animate-pulse">
                Yüklənir...
            </p>
        </div>
    )
}
