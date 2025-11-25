export function Button({ children, className, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
