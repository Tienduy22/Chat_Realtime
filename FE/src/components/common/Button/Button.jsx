import { useState } from "react";

export default function Button({
    children,
    onClick,
    className = "",
    baseClass = "",
    hoverClass = "",
    title,
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            title={title}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`
        inline-flex items-center justify-center gap-1.5 transition-all duration-150
        ${hovered ? hoverClass : baseClass}
        ${className}
      `}
        >
            {children}
        </button>
    );
}
