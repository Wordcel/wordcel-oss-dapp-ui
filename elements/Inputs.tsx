export const SecondaryInput = ({
  label,
  placeHolder,
  onChange,
  value,
  textArea
}: {
  label: string,
  placeHolder: string,
  onChange: (e: any) => void,
  value?: string;
  textArea?: boolean;
}) => {
  return (
    <div className="width-100">
      <p className="input-label">{label}</p>
      <input
        type="text"
        className="input-field"
        onChange={onChange}
        placeholder={placeHolder}
        value={value}
      />
    </div>
  );
};
