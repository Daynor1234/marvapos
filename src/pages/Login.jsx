import { useState } from "react";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { T } from "../theme";
import { login } from "../api";

const Login = ({ onLogin }) => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Completa todos los campos.'); return; }
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.ok) {
        onLogin(res.user);
      } else {
        setError(res.error || 'Correo o contraseña incorrectos.');
      }
    } catch (err) {
      setError('No se puede conectar con el servidor. ¿Está WAMP iniciado?');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(135deg, #6D28D9 0%, #A78BFA 50%, #7C3AED 100%)`,
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            background: `linear-gradient(135deg, ${T.primary}, #A78BFA)`,
            width: 56, height: 56, borderRadius: 14, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 26 }}>M</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: T.text, margin: 0 }}>ActiveZone</h1>
          <p style={{ fontSize: 13, color: T.muted, margin: '4px 0 0' }}>Sistema de ventas · Iniciar sesión</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: T.redLight, color: T.red, borderRadius: 9, padding: '10px 14px',
            fontSize: 13, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.muted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Correo electrónico
          </label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey}
            placeholder="correo@empresa.com"
            style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${T.border}`, borderRadius: 9, fontFamily: 'inherit', fontSize: 14, outline: 'none', color: T.text }}
            onFocus={e => e.target.style.borderColor = T.primary}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: T.muted, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Contraseña
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 42px 10px 14px', border: `1.5px solid ${T.border}`, borderRadius: 9, fontFamily: 'inherit', fontSize: 14, outline: 'none', color: T.text }}
              onFocus={e => e.target.style.borderColor = T.primary}
              onBlur={e => e.target.style.borderColor = T.border}
            />
            <button onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.muted, padding: 0, display: 'flex' }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', padding: '12px', background: loading ? T.muted : T.primary, color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.primaryHover; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = T.primary; }}
        >
          <LogIn size={17} />
          {loading ? 'Verificando...' : 'Ingresar'}
        </button>
      </div>
    </div>
  );
};

export default Login;