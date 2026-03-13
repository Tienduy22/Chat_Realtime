import { useEffect, useState } from "react";
import Avatar from "../../components/common/Avatar/Avatar";
import { X, UserPlus, Trash, Crown } from "lucide-react";
import {
    memberOfConversation,
    addMember,
    deleteMember,
    changeRoleAdmin,
} from "../../services/conversation.service";
import { listFriends } from "../../services/contact.service";
import { useSelector } from "react-redux";
import { sendInvitations } from "../../services/contact.service";

export default function GroupMembersModal({
    conversation_id,
    created_by,
    onClose,
}) {
    const user = useSelector((state) => state.user);

    const [members, setMembers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);

    const isOwner = created_by === user?.user_id;

    useEffect(() => {
        fetchMembers();
        fetchFriends();
    }, []);

    const fetchMembers = async () => {
        try {
            const data = await memberOfConversation(conversation_id);
            setMembers(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFriends = async () => {
        try {
            const data = await listFriends(user.user_id);
            setFriends(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const isFriend = (user_id) => {
        return friends.some((f) => f.contactUser.user_id === user_id);
    };

    const toggleFriend = (id) => {
        if (selectedFriends.includes(id)) {
            setSelectedFriends(selectedFriends.filter((i) => i !== id));
        } else {
            setSelectedFriends([...selectedFriends, id]);
        }
    };

    const friendsNotInGroup = friends.filter(
        (friend) =>
            !members.some(
                (member) => member.user.user_id === friend.contactUser.user_id,
            ),
    );

    const handleAddMembers = async () => {
        try {
            for (const id of selectedFriends) {
                await addMember({
                    conversation_id,
                    admin_id: user.user_id,
                    member_id: id,
                });
            }

            setSelectedFriends([]);
            setShowAdd(false);
            fetchMembers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (member_id) => {
        try {
            await deleteMember({
                conversation_id,
                admin_id: user.user_id,
                member_id,
            });

            fetchMembers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddFriend = async (receiver_id) => {
        try {
            await sendInvitations({
                user_id: user.user_id,
                contact_user_id: receiver_id,
            });
        } catch (error) {
            console.error(error);
            alert("Gửi lời mời thất bại");
        }
    };

    const handleChangeRoleAdmin = async (member_id) => {
        try {
            await changeRoleAdmin({
                conversation_id,
                admin_id: user.user_id,
                member_id,
            });
        } catch (error) {
            console.error(error);
            alert("Thay đổi quyền thất bại");
        }
    };


    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[480px] max-h-[80vh] rounded-xl shadow-xl flex flex-col">
                {/* HEADER */}

                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h3 className="font-semibold text-lg">Thành viên nhóm</h3>

                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ADD MEMBER BUTTON */}

                {isOwner && (
                    <div className="p-4 border-b">
                        <button
                            onClick={() => {
                                setShowAdd(true);
                                fetchFriends();
                            }}
                            className="flex items-center gap-2 bg-[#135bec] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            <UserPlus size={18} />
                            Thêm thành viên
                        </button>
                    </div>
                )}

                {/* MEMBERS LIST */}

                <div className="flex-1 overflow-y-auto">
                    {members?.map((member) => {
                        const memberId = member.user.user_id;
                        const friend = isFriend(memberId);

                        return (
                            <div
                                key={memberId}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        src={member.user.avatar_url}
                                        size="sm"
                                    />

                                    <div>
                                        <p className="font-medium text-sm">
                                            {member.user.full_name}
                                        </p>

                                        {member.role === "owner" && (
                                            <span className="text-xs text-blue-500">
                                                Trưởng nhóm
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* ACTION ICONS */}

                                <div className="flex items-center gap-3">
                                    {/* ADD FRIEND */}

                                    {!isFriend(memberId) &&
                                        memberId !== user.user_id && (
                                            <button
                                                title="Kết bạn"
                                                onClick={() =>
                                                    handleAddFriend(memberId)
                                                }
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <UserPlus size={18} />
                                            </button>
                                        )}

                                    {/* OWNER ACTIONS */}

                                    {isOwner && memberId !== user.user_id && (
                                        <>
                                            <button
                                                title="Chuyển trưởng nhóm"
                                                onClick={() =>
                                                    handleChangeRoleAdmin(
                                                        memberId,
                                                    )
                                                }
                                                className="text-yellow-500 hover:text-yellow-600"
                                            >
                                                <Crown size={18} />
                                            </button>

                                            <button
                                                title="Xóa khỏi nhóm"
                                                onClick={() =>
                                                    handleDelete(memberId)
                                                }
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ADD FRIEND MODAL */}

                {showAdd && (
                    <div className="absolute inset-0 bg-white flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h4 className="font-medium">Thêm thành viên</h4>

                            <button
                                onClick={() => setShowAdd(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {friendsNotInGroup.map((friend) => (
                                <div
                                    key={friend.contactUser.user_id}
                                    onClick={() =>
                                        toggleFriend(friend.contactUser.user_id)
                                    }
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                                        selectedFriends.includes(
                                            friend.contactUser.user_id,
                                        )
                                            ? "bg-blue-50"
                                            : ""
                                    }`}
                                >
                                    <Avatar
                                        src={friend.contactUser.avatar_url}
                                        size="sm"
                                    />

                                    <span className="text-sm font-medium">
                                        {friend.contactUser.full_name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t">
                            <button
                                onClick={handleAddMembers}
                                className="w-full bg-[#135bec] text-white py-2 rounded-lg hover:bg-blue-700"
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
