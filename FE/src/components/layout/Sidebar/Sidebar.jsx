import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Plus,
  LogOut,
  Menu,
  X // Để đóng sidebar trên mobile
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Chỉ dùng cho mobile
  const navigate = useNavigate();
  const location = useLocation();

  const isInConversation = location.pathname.startsWith('/chat/') && location.pathname !== '/chat';

  const currentUser = { name: 'Ricky Smith', avatar: 'RS' };

  const conversations = [
    { id: '1', name: 'Stephanie Sharky', avatar: 'SS', online: true, lastMessage: 'How are you?', time: '10:42 AM', unread: 0 },
    { id: '2', name: 'Rodger Struck', avatar: 'RS', online: false, lastMessage: 'See you later', time: 'Yesterday', unread: 3 },
    { id: '3', name: 'Jerry Helfer', avatar: 'JH', online: true, lastMessage: 'Thanks!', time: '2h ago', unread: 0 },
    { id: '4', name: 'James Hall', avatar: 'JH', online: false, lastMessage: 'Cool!', time: '3h ago', unread: 1 },
    { id: '5', name: 'Lori Warf', avatar: 'LW', online: true, lastMessage: 'Hey!', time: '5m ago', unread: 2 },
  ];

  const handleSelectConversation = (id) => {
    navigate(`/chat/${id}`);
    setIsOpen(false); // Đóng sidebar trên mobile sau khi chọn
  };

  const handleLogout = () => {
    navigate('/login');
  };

  // Tự động mở sidebar trên mobile khi đang xem chi tiết chat (để có nút back)
  // Nhưng mặc định ẩn khi ở trang welcome

  return (
    <>
      {/* Overlay khi mở sidebar trên mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen || isInConversation ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Plus size={22} className="text-gray-600" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition lg:hidden"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search Messenger..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Danh sách cuộc trò chuyện */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectConversation(conv.id)}
              className={`flex items-center gap-3 p-3 mx-2 mt-1 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
                location.pathname === `/chat/${conv.id}` ? 'bg-gray-100' : ''
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {conv.avatar}
                </div>
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="text-gray-900 font-medium truncate">{conv.name}</h4>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <div className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {conv.unread}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Info + Logout */}
        <div className="p-4 border-t border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {currentUser.avatar}
          </div>
          <div className="flex-1">
            <p className="text-gray-900 font-medium">{currentUser.name}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-red-600"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Nút mở sidebar trên mobile - chỉ hiển thị khi chưa mở và không ở trong conversation */}
      {!isOpen && !isInConversation && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition lg:hidden"
        >
          <Menu size={24} />
        </button>
      )}
    </>
  );
};

export default Sidebar;