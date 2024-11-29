'use client'
export default function Button({text, className, onclick}:any) {
    return (
        <div
            className={`button-components ${className}`}
            onClick={onclick}
        >
            <p>{text}</p>
        </div>
    )
}