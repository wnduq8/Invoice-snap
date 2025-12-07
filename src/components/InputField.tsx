export default function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  dark = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  dark?: boolean;
}) {
  return (
    <div>
      <label
        className={`block text-xs font-medium mb-1 ${
          dark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-2 py-1.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          dark
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-200"
        }`}
      />
    </div>
  );
}
