interface IProps {
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
  min?: string;
  max?: string;
}

const DatePicker = ({ label, name, onChange, value, min, max }: IProps) => {
  return (
    <div className="relative w-full">
      <p className="absolute -top-3 left-2 bg-dark-200 rounded px-2">{label}</p>
      <input
        className="bg-dark-200 rounded-[6px] px-5 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary h-12 w-full"
        type="date"
        name={name}
        value={value || ""}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.name, e.target.value)}
      />
    </div>
  );
};

export default DatePicker;
