import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-slate-50">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-slate-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce opacity-25"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-slate-500 rounded-full animate-pulse opacity-20"></div>
        <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-gray-400 rounded-full animate-ping opacity-30"></div>
      </div>

      {/* Main loading container */}
      <div className="relative z-10 flex flex-col items-center space-y-8" dir="rtl">
        {/* Logo container with enhanced animations */}
        <div className="relative">
          {/* Outer ring */}
          <div
            className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent  from-gray-400 via-slate-500 to-gray-600 animate-spin"
            style={{ animationDuration: '3s' }}
          >
            <div className="absolute inset-1 bg-white rounded-full"></div>
          </div>

          {/* Inner pulsing ring */}
          <div className="absolute inset-2 w-28 h-28 rounded-full  from-gray-300 to-slate-400 animate-pulse opacity-20"></div>

          {/* Logo */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div
              className="animate-spin w-20 h-20"
              style={{ animationDuration: '8s', animationDirection: 'reverse' }}
            >
              <Image
                src="/Images/Logo/Uni_Logo_Transparent.png"
                alt="loading"
                className="w-full h-full object-contain drop-shadow-lg"
                width={80}
                height={80}
              />
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 bg-clip-text text-transparent animate-pulse">
            در حال بارگذاری...
          </h2>

          {/* Animated progress bar */}
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gray-500 via-slate-500 to-gray-600 rounded-full animate-pulse relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Loading dots */}
          <div className="flex justify-center space-x-2">
            <div
              className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="w-3 h-3 bg-slate-500 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="w-3 h-3 bg-gray-600 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
        </div>

        {/* Subtle loading message */}
        <p className="text-gray-600 text-sm font-medium animate-pulse">لطفاً منتظر بمانید...</p>
      </div>

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-500/5 via-transparent to-slate-500/5 animate-pulse"></div>
    </div>
  );
}
