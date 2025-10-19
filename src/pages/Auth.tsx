import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (!email || !password) {
      setError('Email y contraseña requeridos');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!isLogin && password.length < 8) {
      setError('Mínimo 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Simulación 1s
      setTimeout(() => {
        sessionStorage.setItem('user', JSON.stringify({ email, role: null }));
        navigate('/select-role');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Error en autenticación');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT - Gradient (Hidden en mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 flex-col items-center justify-center p-8 text-white relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md text-center relative z-10 space-y-8">
          <div>
            <h2 className="text-5xl font-bold mb-4">
              {isLogin ? 'Bienvenido de vuelta' : 'Comienza tu viaje'}
            </h2>
            <p className="text-lg text-indigo-100">
              {isLogin
                ? 'Accedé a tu ecosistema completo'
                : 'Empezá a validar, organizar y crecer'}
            </p>
          </div>

          <ul className="text-left space-y-3 text-indigo-50">
            <li className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span>Sin tarjeta de crédito</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span>Datos seguros y cifrados</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <span>Acceso inmediato</span>
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1"
          >
            ← Volver
          </button>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? 'Accedé a tu cuenta'
                : 'Únete a miles de emprendedores'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition bg-gray-50"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? '••••••••' : 'Mínimo 8 caracteres'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password (Signup) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar contraseña"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition bg-gray-50"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
            >
              {loading
                ? 'Cargando...'
                : isLogin
                ? 'Iniciar Sesión'
                : 'Crear Cuenta'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O</span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={() => alert('Google OAuth - Próximamente')}
              className="w-full py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <span>🔵</span>
              Continuar con Google
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Crear una
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Iniciar sesión
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p>Al continuar, aceptas nuestros Términos y Privacidad</p>
          </div>
        </div>
      </div>
    </div>
  );
}
