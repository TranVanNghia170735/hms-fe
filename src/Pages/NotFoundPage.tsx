import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
   const navigate = useNavigate();
   return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 relative overflow-hidden">
         <div className="max-w-2xl w-full text-center">
            {/* 404 */}
            <h1 className="text-8xl md:text-9xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse">
               404
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-xl md:text-2xl font-semibold animate-fade-in">Page not found</p>

            {/* Description */}
            <p className="mt-2 text-gray-300 animate-fade-in delay-200">
               The page you are looking for doesn’t exist or has been moved.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300">
               <Link to="/" className="px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition shadow-lg">
                  Go Home
               </Link>

               <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 rounded-2xl border border-gray-600 hover:bg-gray-800 transition"
               >
                  Go Back
               </button>
            </div>
         </div>

         {/* Decorative glow */}
         <div className="absolute inset-0 -z-10">
            <div className="absolute w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full top-10 left-10"></div>
            <div className="absolute w-72 h-72 bg-indigo-500 opacity-20 blur-3xl rounded-full bottom-10 right-10"></div>
         </div>

         {/* Custom animations */}
         <style>{`
            .animate-fade-in {
               opacity: 0;
               transform: translateY(10px);
               animation: fadeIn 0.6s ease forwards;
            }

            .delay-200 {
               animation-delay: 0.2s;
            }

            .delay-300 {
               animation-delay: 0.3s;
            }

            @keyframes fadeIn {
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
            }
         `}</style>
      </div>
   );
}
