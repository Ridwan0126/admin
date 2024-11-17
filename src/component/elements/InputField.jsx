import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ 
    label, 
    type = "text", 
    placeholder, 
    isPassword = false,
    value,             // Tambahkan value
    onChange           // Tambahkan onChange
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Tambahkan kondisi untuk mengecek apakah label harus di atas
    const isLabelFloating = isFocused || showPassword || value; // periksa apakah ada nilai untuk mengatur floating label

    return (
      <div className="relative mb-6">
        <div className="relative">
          <input
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className="w-full px-3 py-2 text-sm border-4 rounded-lg h-12 text-slate-700
                     focus:border-customTeal focus:outline-none transition-colors duration-200"
            style={{ 
              borderColor: isFocused ? 'rgb(85, 179, 164)' : '#e5e7eb' 
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={value}                // Tambahkan value di sini
            onChange={onChange}           // Tambahkan onChange di sini
            placeholder={placeholder}     // Tambahkan placeholder
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        <label 
          className={`absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none
          ${isLabelFloating ? '-top-3 text-slate-700 text-sm' : 'top-2.5 text-slate-500'}`}
        >
          {label}
        </label>
      </div>
    );
};

export default InputField;