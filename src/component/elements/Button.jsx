const Button = ({ children, variant = "primary", onClick }) => {
    const baseStyle = "w-full py-3 rounded-lg font-medium transition-colors duration-200";
    const variants = {
      primary: "bg-customTeal text-white",
      secondary: "border-2 border-black text-black hover:bg-gray-50"
    };
  
    return (
      <button 
        className={`${baseStyle} ${variants[variant]}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

export default Button