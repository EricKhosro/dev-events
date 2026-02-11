interface IOption {
  label: string;
  value: string | number;
}

interface IProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (name: string, value: any) => void;
  options: IOption[];
}

const StaticDropdown = ({ name, label, value, onChange, options }: IProps) => {
  return (
    <div className="relative w-full">
      <p className="absolute -top-3 left-2 bg-dark-200 rounded px-2">{label}</p>

      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.name, e.target.value)}
        className="bg-dark-200 rounded-[6px] px-5 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary h-12 w-full appearance-none cursor-pointer"
      >
        <option value="" disabled hidden>
          Select {label}
        </option>

        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-dark-200 text-white hover:bg-dark-300 cursor-pointer py-2"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StaticDropdown;
