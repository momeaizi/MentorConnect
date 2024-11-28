export default function Button({text, className, onclick}:any) {
    console.log("09090909")
    return (
        <div
            className={`button-components ${className}`}
            onClick={onclick}
        >
            <p>{text}</p>
        </div>
    )
}