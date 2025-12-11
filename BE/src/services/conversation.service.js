const conversationReponsitory = require("../repositories/conversation.reponsitory");
const userReponsitory = require("../repositories/user.reponsitory");
const blockedUserReponsitory = require("../repositories/blockedUser.reponsitory");

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

module.exports = {
    createNewGroupConversation,
    addMember,
    deleteMember,
    memberLeave,
    adminLeave
};
