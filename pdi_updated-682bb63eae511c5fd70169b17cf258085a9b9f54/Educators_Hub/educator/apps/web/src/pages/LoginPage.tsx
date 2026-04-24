import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { mockLogin } from '../services/authService';

const credentials = [
  { email: 'teacher@ekya.test', role: 'teacher' },
  { email: 'hos@ekya.test', role: 'hos' },
  { email: 'admin@ekya.test', role: 'admin' },
  { email: 'management@ekya.test', role: 'management' },
  { email: 'superadmin@ekya.test', role: 'superadmin' }
];

const roleColors: Record<string, string> = {
  teacher: 'from-emerald-500 to-teal-600',
  hos: 'from-violet-500 to-purple-600',
  admin: 'from-amber-500 to-orange-600',
  management: 'from-cyan-500 to-blue-600',
  superadmin: 'from-rose-500 to-pink-600'
};

const roleIcons: Record<string, string> = {
  teacher: '📚',
  hos: '🏛',
  admin: '⚙️',
  management: '📊',
  superadmin: '👑'
};

export function LoginPage() {
  const [email, setEmail] = useState('teacher@ekya.test');
  const [password, setPassword] = useState('Teacher123!');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const user = await mockLogin(email, password);
    setIsLoading(false);

    if (!user) {
      setError('Invalid credentials');
      return;
    }

    setUser(user);
    setError('');
    navigate(`/${user.role}/home`, { replace: true });
  };

  const selectedRole = credentials.find(c => c.email === email)?.role || 'teacher';

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent">
      {/* Dynamic Animated Background Mesh */}
      <div className="absolute inset-0 bg-transparent" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px] animate-float-slow" />
      <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-400/20 blur-[130px] animate-float-med" />
      <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-400/20 blur-[120px] animate-float-fast" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 animate-float-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 animate-float-med" />

      <div className="relative w-full max-w-[420px] p-6 animate-slide-up z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-ekya-primary to-teal-600 shadow-lg">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Ekya Educator</h1>
          <p className="text-slate-600">Welcome back! Sign in to continue your journey.</p>
        </div>

        {/* Main Card */}
        <div className="glass-panel p-8 relative overflow-hidden">
          {/* Decorative gradient line */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${roleColors[selectedRole]} shadow-[0_0_20px_rgba(255,255,255,0.5)]`} />
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:-translate-y-1 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-xl bg-gradient-to-r ${roleColors[selectedRole]} relative overflow-hidden`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Role Selector */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">Quick Login (Demo)</p>
            <div className="grid grid-cols-5 gap-2">
              {credentials.map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(getPassword(cred.role));
                  }}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ease-out ${
                    email === cred.email 
                      ? 'bg-white shadow-md ring-2 ring-indigo-500 scale-105' 
                      : 'hover:bg-white/50 hover:shadow-sm'
                  }`}
                  title={getPassword(cred.role)}
                >
                  <span className="text-lg mb-1">{roleIcons[cred.role]}</span>
                  <span className="text-[10px] font-medium text-slate-600 capitalize">{cred.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Powered by <span className="text-gradient font-semibold">Ekya Schools</span>
        </p>
      </div>
    </div>
  );
}

function getPassword(role: string) {
  switch (role) {
    case 'teacher': return 'Teacher123!';
    case 'hos': return 'HoS123!';
    case 'admin': return 'Admin123!';
    case 'management': return 'Mgmt123!';
    case 'superadmin': return 'Super123!';
    default: return 'Password1!';
  }
}