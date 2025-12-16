const conversationReponsitory = require("../repositories/conversation.reponsitory");
const userReponsitory = require("../repositories/user.reponsitory");
const blockedUserReponsitory = require("../repositories/blockedUser.reponsitory");
const messageReponsitory = require("../repositories/message.reponsitory");

const createNewGroupConversation = async (data, images) => {
    try {
        const { admin_id, member_ids, name } = data;
        const avatar_url = images[0];

        const admin = await userReponsitory.findById(admin_id)
        if(!admin) {
            throw {
                statusCode: 404,
                message: "Tài khoản admin không tồn tại hoặc bị khóa"
            }
        }

        const members = await userReponsitory.findAll(member_ids)
        if(members.length != member_ids.length) {
            throw {
                statusCode: 404,
                message: "Có tài khoản member không tồn tại hoặc bị khóa"
            }
        }

        const blocks = await blockedUserReponsitory.findBlockAll(admin_id, member_ids)
        if(blocks.length > 0){
            throw {
                statusCode: 409,
                message: "Không thể tạo nhóm với người đã blocked"
            }
        }

        const groupConversation =
            await conversationReponsitory.createNewGroupConversation(
                admin_id,
                member_ids,
                name,
                avatar_url
            );

        return groupConversation;
    } catch (error) {
        throw error;
    }
};

const addMember = async ({conversation_id, admin_id, member_id}) => {
    try {
        const conversation = await conversationReponsitory.findById(conversation_id)
        if(!conversation) {
            throw {
                statusCode: 404,
                message: "Cuộc trò chuyện không tồn tại"
            }
        }

        const member = await userReponsitory.findById(member_id)
        if(!member) {
            throw {
                statusCode: 404,
                message: "Member không tồn tại"
            }
        }

        const block = await blockedUserReponsitory.findBlock(admin_id, member_id)
        if(block){
            throw {
                statusCode: 409,
                message: "Không thể tạo nhóm với người đã blocked"
            }
        }

        const existMemberOfGroup = await conversationReponsitory.findMemberOfGroup(conversation_id, member_id)
        if(existMemberOfGroup) {
            throw {
                statusCode: 409,
                message: "Người này đã ở trong nhóm rồi"
            }
        }

        const newMember = await conversationReponsitory.addMember(conversation_id, member_id)
        return newMember
    } catch (error) {
        throw error
    }
}

const deleteMember = async ({conversation_id, admin_id, member_id}) => {
    try {
        const conversation = await conversationReponsitory.findById(conversation_id)
        if(!conversation) {
            throw {
                statusCode: 404,
                message: "Cuộc trò chuyện không tồn tại"
            }
        }

        const member = await userReponsitory.findById(member_id)
        if(!member) {
            throw {
                statusCode: 404,
                message: "Member không tồn tại"
            }
        }

        const adminGroup = await conversationReponsitory.findMemberOfGroup(conversation_id, admin_id)
        if(adminGroup.role != "admin") {
            throw {
                statusCode: 401,
                message: "Tài khoản không phải admin không có quyền xóa"
            }
        }

        await conversationReponsitory.deleteMember(conversation_id, member_id)
        return {
            message: "Xóa thành viên khỏi nhóm thành công"
        }
    } catch (error) {
        throw error
    }
}

const memberLeave = async ({conversation_id, member_id}) => {
    try {
        const conversation = await conversationReponsitory.findById(conversation_id)
        if(!conversation) {
            throw {
                statusCode: 404,
                message: "Cuộc trò chuyện không tồn tại"
            }
        }

        const member = await userReponsitory.findById(member_id)
        if(!member) {
            throw {
                statusCode: 404,
                message: "Member không tồn tại"
            }
        }

        await conversationReponsitory.deleteMember(conversation_id, member_id)

        return {
            message: "Rời nhóm thành công"
        }
    } catch (error) {
        throw error
    }
}

const adminLeave = async ({conversation_id, admin_id, member_id}) => {
    try {
        const conversation = await conversationReponsitory.findById(conversation_id)
        if(!conversation) {
            throw {
                statusCode: 404,
                message: "Cuộc trò chuyện không tồn tại"
            }
        }

        const member = await userReponsitory.findById(member_id)
        if(!member) {
            throw {
                statusCode: 404,
                message: "Member không tồn tại"
            }
        }

        const participant = await conversationReponsitory.findMemberOfGroup(conversation_id, member_id)
        if(!participant) {
            throw {
                statusCode: 404,
                message: "Member không có trong nhóm"
            }
        }
        await conversationReponsitory.updateRoleParticipant("admin", participant.participant_id)

        await conversationReponsitory.deleteMember(conversation_id, admin_id)
        return {
            message: "Rời nhóm thành công"
        }
    } catch (error) {
        throw error
    }
}

const changeRoleAdmin = async ({conversation_id, admin_id, member_id}) => {
    try {
        const conversation = await conversationReponsitory.findById(conversation_id)
        if(!conversation) {
            throw {
                statusCode: 404,
                message: "Cuộc trò chuyện không tồn tại"
            }
        }

        const admin = await userReponsitory.findById(admin_id)
        if(!admin) {
            throw {
                statusCode: 404,
                message: "Admin không tồn tại"
            }
        }

        const member = await userReponsitory.findById(member_id)
        if(!member) {
            throw {
                statusCode: 404,
                message: "Member không tồn tại"
            }
        }

        const participantMember = await conversationReponsitory.findMemberOfGroup(conversation_id, member_id)
        const participantAdmin = await conversationReponsitory.findMemberOfGroup(conversation_id, admin_id)
        if(participantAdmin.role != "admin") {
            throw {
                statusCode: 404,
                message: "Tài khoản này không phải admin"
            }
        }
        if(!participantMember) {
            throw {
                statusCode: 404,
                message: "Member không có trong nhóm"
            }
        }

        await conversationReponsitory.updateRoleParticipant("admin", participantMember.participant_id)
        await conversationReponsitory.updateRoleParticipant("member", participantAdmin.participant_id)

        return {
            message: "Thay đổi admin mới thành công"
        }
    } catch (error) {
        throw error
    }
}

const changeName = async ({conversation_id, name, admin_id}) => {
    try {
        const conversation = await conversationReponsitory.findById(conversation_id)
        if(!conversation) {
            throw {
                statusCode: 404,
                message: "Cuộc trò chuyện không tồn tại"
            }
        }

        const participantAdmin = await conversationReponsitory.findMemberOfGroup(conversation_id, admin_id)
        if(participantAdmin.role != "admin") {
            throw {
                statusCode: 404,
                message: "Tài khoản này không phải admin không có quyền thay đổi tên"
            }
        }

        await conversationReponsitory.changeName(conversation_id, name)
        return {
            message: "Thay đổi tên nhóm thành công"
        }
    } catch (error) {
        throw error
    }
}

const changeAvatar = async ({conversation_id, admin_id}, avatar_url) => {
    try {
        const conversation = await conversationReponsitory.findById(conversation_id)
        if(!conversation) {
            throw {
                statusCode: 404,
                message: "Cuộc trò chuyện không tồn tại"
            }
        }

        const participantAdmin = await conversationReponsitory.findMemberOfGroup(conversation_id, admin_id)
        if(participantAdmin.role != "admin") {
            throw {
                statusCode: 404,
                message: "Tài khoản này không phải admin không có quyền thay đổi ảnh nhóm"
            }
        }

        await conversationReponsitory.changeAvatar(conversation_id, avatar_url[0])
        return {
            message: "Thay đổi ảnh nhóm thành công"
        }
    } catch (error) {
        throw error
    }
}

const changeNotification = async ({conversation_id, member_id}) => {
    try {
        const conversation = await conversationReponsitory.findById(conversation_id)
        if(!conversation) {
            throw {
                statusCode: 404,
                message: "Cuộc trò chuyện không tồn tại"
            }
        }

        const member = await userReponsitory.findById(member_id)
        if(!member) {
            throw {
                statusCode: 404,
                message: "Member không tồn tại"
            }
        }

        let is_muted
        const participantMember = await conversationReponsitory.findMemberOfGroup(conversation_id, member_id)
        if(participantMember.is_muted == "true") {
            is_muted = false
        } else {
            is_muted = true
        }
        await conversationReponsitory.changeNotification(conversation_id, member_id, is_muted)

        return {
            message: "Thay đổi trạng thái thông báo thành công"
        }
    } catch (error) {
        throw error
    }
}

const AllMessageOfConversation = async (
    conversation_id,
    user_id,
    limit,
    offset
) => {
    try {
        const conversation = await conversationReponsitory.findById(
            conversation_id
        );
        if (!conversation) {
            throw {
                statusCode: 404,
                message: "Cuộc trò chuyện không tồn tại",
            };
        }

        const user = await conversationReponsitory.findMemberOfGroup(
            conversation_id,
            user_id
        );
        if (!user) {
            throw {
                statusCode: 404,
                message: "tài khoản này không có quyền xem cuộc trò chuyện này",
            };
        }

        const messages = await messageReponsitory.AllMessageOfConversation(
            conversation_id,
            limit,
            offset
        );

        return messages;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createNewGroupConversation,
    addMember,
    deleteMember,
    memberLeave,
    adminLeave,
    changeRoleAdmin,
    changeName,
    changeAvatar,
    changeNotification,
    AllMessageOfConversation
};
