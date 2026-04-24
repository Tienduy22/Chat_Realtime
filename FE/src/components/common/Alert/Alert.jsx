import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const variants = {
    info: {
        icon: Info,
        style: "bg-slate-50 border-slate-200 text-slate-700",
    },
    success: {
        icon: CheckCircle,
        style: "bg-green-50 border-green-200 text-green-700",
    },
    warning: {
        icon: AlertTriangle,
        style: "bg-yellow-50 border-yellow-200 text-yellow-700",
    },
    error: {
        icon: XCircle,
        style: "bg-red-50 border-red-200 text-red-700",
    },
};

export default function Alert({
    type = "info",
    message,
    className = "",
}) {
    const { icon: Icon, style } = variants[type] || variants.info;

    return (
        <div
            className={`
            flex items-start gap-3
            border rounded-lg
            px-4 py-3
            text-sm
            ${style}
            ${className}
        `}
        >
            <Icon size={18} className="mt-[2px] shrink-0" />

            <div className="flex-1 leading-relaxed">
                {message}
            </div>
        </div>
    );
}