import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-300">404</h1>
                <p className="text-2xl font-semibold text-gray-700 mt-4">
                    Không tìm thấy trang
                </p>
                <p className="text-gray-500 mt-2 mb-8">
                    Trang bạn đang tìm kiếm không tồn tại
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    >
                        Quay lại
                    </button>
                    <Link
                        to="/chat"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
