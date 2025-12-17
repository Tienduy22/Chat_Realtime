// components/Avatar.jsx
export default function Avatar({
    src,
    size = "md",
    status = null,
    className = "",
}) {
    const sizes = {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
        xl: "size-20",
    };

    const statusColor = {
        online: "bg-[#0bda5e]",
        away: "bg-yellow-500",
        offline: "bg-gray-500",
    };

    return (
        <div className={`relative shrink-0 ${className}`}>
            <div
                className={`bg-cover bg-center rounded-full ${sizes[size]} shadow-sm`}
                style={{ backgroundImage: `url(${src})` }}
            />
            {status && (
                <div
                    className={`absolute bottom-0 right-0 ${
                        size === "sm" ? "size-2.5" : "size-3"
                    } rounded-full ${statusColor[status]} border-2 border-white`}
                />
            )}
        </div>
    );
}
