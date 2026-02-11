interface IProps {
  name: string;
  label: string;
  placeholder: string;
  value: number | string;
  onChange: (name: string, value: any) => void;
  type?: "password";
}

const TextInput = ({
  label,
  onChange,
  placeholder,
  value,
  name,
  type,
}: IProps) => {
  return (
    <div className="relative w-full">
      <p className="absolute -top-3 left-2 bg-dark-200 rounded px-2">{label}</p>
      <input
        className="bg-dark-200 rounded-[6px] px-5 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary h-12 w-full"
        name={name}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.name, e.target.value)}
        type={type}
      />
    </div>
  );
};

export default TextInput;
