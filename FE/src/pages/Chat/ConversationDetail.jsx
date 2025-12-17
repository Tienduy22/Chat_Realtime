import { useParams, useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Video, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile,
  ThumbsUp,
  Image as ImageIcon,
  X,
  ChevronDown
} from 'lucide-react';

export default function ConversationDetail() {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  // Mock data
  const conversation = {
    id: conversationId,
    name: 'Ricky Smith',
    avatar: '/api/placeholder/200/200', // Thay bằng ảnh thực hoặc component avatar
    online: true,
    isSelf: true // Vì chat với chính mình trong ảnh demo
  };

  // Mock media images (thay bằng dữ liệu thực sau)
  const mediaImages = [
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1495467033336-2effd8753d51?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1518715303804-4ee8b6d0c0d1?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1559827260-dc66d52befaf?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Khu vực chat chính */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/chat')}
              className="p-2 hover:bg-gray-100 rounded-full lg:hidden"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-300 bg-cover bg-center" 
                 style={{ backgroundImage: 'ur[](https://randomuser.me/api/portraits/men/32.jpg)' }} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{conversation.name}</h2>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 hover:bg-gray-100 rounded-full"><Phone size={20} className="text-blue-600" /></button>
            <button className="p-3 hover:bg-gray-100 rounded-full"><Video size={20} className="text-blue-600" /></button>
            <button className="p-3 hover:bg-gray-100 rounded-full"><Search size={20} className="text-blue-600" /></button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Date Separator */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 bg-gray-50">YESTERDAY</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Message from other/self */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-300 bg-cover" style={{ backgroundImage: 'ur[](https://randomuser.me/api/portraits/men/32.jpg)' }} />
              <div>
                <p className="text-sm text-gray-600 mb-1">Ricky Smith 11:00 AM</p>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm inline-block">
                  <p>Hi! How are you? 😊</p>
                </div>
              </div>
            </div>

            {/* Voice note */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-300 bg-cover" style={{ backgroundImage: 'ur[](https://randomuser.me/api/portraits/men/32.jpg)' }} />
              <div>
                <p className="text-sm text-gray-600 mb-1">Ricky Smith 12:03 PM</p>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                  <button className="text-blue-600">▶</button>
                  <div className="flex-1 h-8 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">0:30</span>
                </div>
              </div>
            </div>

            {/* My messages (blue) */}
            <div className="flex items-end justify-end gap-3 mb-6">
              <div className="max-w-md">
                <p className="text-xs text-gray-500 text-right mb-1">12:42 - You</p>
                <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-sm">
                  <p>Hey Ricky! I'm feeling Amazing, how about you?</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-300 bg-cover" style={{ backgroundImage: 'ur[](https://randomuser.me/api/portraits/men/32.jpg)' }} />
            </div>

            <div className="flex items-end justify-end gap-3 mb-6">
              <div className="max-w-md">
                <p className="text-xs text-gray-500 text-right mb-1">12:42 - You</p>
                <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-sm">
                  <p>That's a cool idea! 😊</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-300 bg-cover" style={{ backgroundImage: 'ur[](https://randomuser.me/api/portraits/men/32.jpg)' }} />
              <div>
                <p className="text-sm text-gray-600 mb-1">Ricky Smith 12:42 PM</p>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm inline-block">
                  <p>Hey, so happy you are down! 😊</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full"><Paperclip size={24} className="text-gray-600" /></button>
            <input
              type="text"
              placeholder="Write something..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="p-2 hover:bg-gray-100 rounded-full"><Smile size={24} className="text-gray-600" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full"><ImageIcon size={24} className="text-gray-600" /></button>
            <button className="p-2 hover:bg-blue-100 rounded-full text-blue-600"><ThumbsUp size={24} /></button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Info Panel (ẩn trên mobile) */}
      <div className="hidden lg:block w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Profile Header */}
        <div className="p-8 text-center border-b border-gray-200">
          <div className="w-32 h-32 mx-auto rounded-full bg-gray-300 bg-cover mb-4" 
               style={{ backgroundImage: 'ur[](https://randomuser.me/api/portraits/men/32.jpg)' }} />
          <h2 className="text-2xl font-bold text-gray-900">{conversation.name}</h2>
          <p className="text-sm text-gray-500">You</p>
          <div className="flex justify-center gap-3 mt-6">
            <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"><ProfileIcon /></button>
            <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"><MuteIcon /></button>
            <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"><Search size={20} className="text-gray-600" /></button>
          </div>
        </div>

        {/* Customize Chat */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg">
            <span className="font-medium text-gray-900">Customize Chat</span>
            <ChevronDown size={20} className="text-gray-500" />
          </div>
        </div>

        {/* Media, Files and Links */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Media, Files And Links</h3>
            <div className="flex gap-2 mb-4">
              <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-medium">Media</button>
              <button className="px-4 py-2 hover:bg-gray-100 rounded-full">Files</button>
              <button className="px-4 py-2 hover:bg-gray-100 rounded-full">Links</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {mediaImages.map((src, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                  <img src={src} alt="Media" className="w-full h-full object-cover hover:scale-110 transition" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy & Support */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-900">Privacy and Support</span>
            <ChevronDown size={20} className="text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon placeholder (bạn có thể thay bằng lucide hoặc svg)
const ProfileIcon = () => <div className="w-5 h-5 bg-gray-600 rounded" />;
const MuteIcon = () => <div className="w-5 h-5 bg-gray-600 rounded" />;
