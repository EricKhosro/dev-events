import Image from "next/image";

interface IProps {
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
  helperText?: string;
  step?: number;
}

const TimePicker = ({ label, name, onChange, value, step = 300 }: IProps) => {
  return (
    <div className="relative w-full time-input">
      <p className="absolute -top-3 left-2 bg-dark-200 rounded px-2">{label}</p>
      <div className="time-input__field">
        <Image src="/icons/clock.svg" alt="" width={16} height={16} />
        <input
          className="time-input__control"
          type="time"
          name={name}
          value={value || ""}
          step={step}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
        <span className="time-input__badge">Local</span>
      </div>
    </div>
  );
};

export default TimePicker;
