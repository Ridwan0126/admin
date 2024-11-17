import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../component/elements/InputField';
import Button from '../../component/elements/Button';
import Logo from '../../assets/logo.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login data sebelum dikirim:", { email, password }); // Debugging tambahan

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
    } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-gray-50 p-4 md:p-8 lg:p-12">
      <div className="w-full md:w-2/5 lg:w-1/3 bg-white rounded-xl shadow-lg p-6 sm:p-8 md:mr-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl text-customTeal font-bold mb-2">Login</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Please login to continue to your account.
          </p>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
          <InputField 
            label="Email" 
            isEmail 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <InputField 
            label="Password" 
            isPassword 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <div className="space-y-3 sm:space-y-4">
            <Button className="w-full" type="submit">
              Login
            </Button>
          </div>
        </form>
      </div>

      <div className="hidden md:flex items-center justify-center md:w-2/5 lg:w-1/3">
        <img src={Logo} className="w-full max-w-md h-auto object-contain" alt="logo desktop" />
      </div>
    </div>
  );
};

export default LoginPage;