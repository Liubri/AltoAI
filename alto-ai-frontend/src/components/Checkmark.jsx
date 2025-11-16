import { Tooltip } from 'react-tooltip'
export default function Checkmark({ name, checked, onChange, disabled, ...props }) {
  return (
    <label
      className={`relative flex items-center cursor-pointer select-none text-lg ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      {...props} // pass down data-tooltip
    >
      {/* Hidden native checkbox */}
      <input
        type="checkbox"
        className="absolute opacity-0 w-0 h-0"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />

      {/* Custom checkbox */}
      <div
        className={`relative w-6 h-6 rounded-lg transition-all duration-300 
          ${checked ? "bg-green-400 scale-100" : "bg-gray-300 scale-100"} 
          flex items-center justify-center`}
      >
        {/* Centered checkmark */}
        {checked && (
          <div className="w-[0.5rem] h-[1rem] border-white border-r-2 border-b-2 rotate-45"></div>
        )}
      </div>

      <span className="ml-1">{name}</span>
    </label>
  );
}