
interface ButtonProps {
  text: string;
  className?: string;
  onclick?: () => void;
  disabled?: boolean;
}

export default function Button({ text, className, onclick, disabled }: ButtonProps) {
  return (
    <div
      className={`button-component ${className || ''} ${disabled ? 'disabled' : ''}`}
      onClick={!disabled ? onclick : undefined}
    >
      <p>{text}</p>
    </div>
  );
}
