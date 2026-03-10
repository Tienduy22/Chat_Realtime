export default function Icon({ n, size = 20, color = "currentColor", className = "" }) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={{ fontSize: size, color }}
        >
            {n}
        </span>
    );
}
