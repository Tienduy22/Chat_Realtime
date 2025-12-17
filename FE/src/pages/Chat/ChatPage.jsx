import { Users, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const navigate = useNavigate();

  const onlineUsers = [
    { id: 1, name: 'Stephanie Sharky', avatar: 'SS' },
    { id: 3, name: 'Jerry Helfer', avatar: 'JH' },
    { id: 5, name: 'Lori Warf', avatar: 'LW' },
    { id: 6, name: 'Michael Chen', avatar: 'MC' },
  ];

  const openSidebar = () => {
    // Dispatch event hoặc dùng context nếu cần, nhưng vì có nút floating rồi nên không cần
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <MessageCircle size={80} className="text-blue-600 mx-auto mb-6" />
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Messenger</h2>
        <p className="text-gray-600 text-lg mb-12">
          Send messages, photos, and stay connected with friends.
        </p>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2 justify-center">
            <Users className="text-green-600" size={24} />
            Active Now ({onlineUsers.length})
          </h3>
          <div className="flex flex-wrap gap-6 justify-center">
            {onlineUsers.map((user) => (
              <div key={user.id} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {user.avatar}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <p className="text-sm text-gray-700 mt-2 font-medium">{user.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;