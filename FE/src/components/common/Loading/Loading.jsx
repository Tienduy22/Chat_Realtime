const Loading = ({ fullScreen = false, size = "md" }) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div
                        className={`${sizeClasses.lg} border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto`}
                    ></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            <div
                className={`${sizeClasses[size]} border-4 border-blue-600 border-t-transparent rounded-full animate-spin`}
            ></div>
        </div>
    );
};

export default Loading;
