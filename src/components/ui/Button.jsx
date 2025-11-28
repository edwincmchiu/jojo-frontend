import classNames from 'classnames';

export default function Button({ children, variant = 'primary', className, ...props }) {
  const baseStyle = "w-full py-3 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2";
  const variants = {
    primary: "bg-brand-dark text-white hover:bg-gray-800",
    secondary: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    action: "bg-brand-yellow text-brand-dark hover:brightness-105"
  };

  return (
    <button className={classNames(baseStyle, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}