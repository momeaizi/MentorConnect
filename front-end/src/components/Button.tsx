interface ButtonProps {
    text: string;
    className?: string;
    onclick?: () => void;
  }
  
  export default function Button({ text, className, onclick }: ButtonProps) {
    return (
      <div
        className={`button-components ${className || ''}`}
        onClick={onclick}
      >
        <p>{text}</p>
      </div>
    );
  }
  