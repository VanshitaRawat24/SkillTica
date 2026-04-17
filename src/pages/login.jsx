import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Hardcoded HR logic for hackathon demo speed: "admin@peopleiq.io", "admin123"

    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    if (res.error) {
      setError(res.error);
    } else {
      // route based on email
      if (email === 'admin@peopleiq.io') {
        navigate('/hr/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />

      <div className="login-card animate-fade-in" style={{ padding: '2.5rem', maxWidth: 440, width: '100%' }}>
        <div className="login-logo text-center flex justify-center mb-6">
          <div className="logo-icon flex items-center justify-center p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'white' }}>
            <Brain size={40} />
          </div>
        </div>

        <h1 className="login-title text-center text-3xl font-bold mb-2">People Intelligence</h1>
        <p className="login-sub text-center text-secondary mb-8">Not just tracking employees, but understanding their potential.</p>

        {error && <div className="p-3 bg-red-900/20 border border-red-500/30 text-danger text-sm rounded-lg mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-4 text-left">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input required className="form-control" type="text" placeholder="Alex Mercer" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}

          <div className="form-group mb-4">
            <label className="form-label">Email</label>
            <input required className="form-control" type="email" placeholder="email@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input required className="form-control" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: '2.5rem', width: '100%' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full p-3 text-lg justify-center mt-2 flex gap-2 w-100">
            {isLogin ? 'Log In' : 'Sign Up'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-secondary">
          {isLogin ? (
            <p>New employee? <button onClick={() => setIsLogin(false)} className="text-accent font-semibold ml-1">Create an account</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setIsLogin(true)} className="text-accent font-semibold ml-1">Log in</button></p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-tertiary text-center">
          HR Admin Demo Login:<br /><span className="font-mono text-secondary">admin@peopleiq.io / admin123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
