import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      {/* Left Side - Branding & Information (Hidden on smaller screens) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="max-w-lg relative z-10">
          <div className="flex items-center gap-3 mb-8">
            {/* Placeholder for Logo */}
            <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center font-bold text-xl">
              AF
            </div>
            <h1 className="text-3xl font-bold">AssetFlow Enterprise</h1>
          </div>
          
          <h2 className="text-4xl font-semibold mb-6 leading-tight">
            Manage your corporate assets with absolute precision.
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Streamline your hardware and software inventory. Track assignments, forecast maintenance, and utilize predictive analytics securely.
          </p>
          
          <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 backdrop-blur-sm">
            <blockquote className="text-slate-200 italic mb-4">
              "System access is strictly monitored. Ensure you are using authorized credentials."
            </blockquote>
            <p className="text-sm text-slate-400 font-medium">— IT Administration</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md flex flex-col justify-center">
          
          {/* Mobile Header (Only visible on small screens) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">
              AF
            </div>
            <h1 className="text-2xl font-bold text-slate-900">AssetFlow</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Please enter your credentials to access your dashboard.</p>
          </div>
          
          {/* Injecting the previously built form here */}
          <LoginForm />
          
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Need help logging in? <a href="#" className="text-blue-600 hover:underline">Contact IT Support</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};
