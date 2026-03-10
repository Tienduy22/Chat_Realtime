export default function Label({ children, count, dot, className = "" }) {
    return (
        <div className={`flex items-center gap-2 mb-3.5 ${className}`}>
            <span className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider">
                {children}
            </span>
            {count !== undefined && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                    {count}
                </span>
            )}
            {dot && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            )}
        </div>
    );
}
