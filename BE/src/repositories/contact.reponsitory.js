const { User, Contact } = require("../models");

const findById = async (contact_id) => {
    try {
        const contact = await Contact.findByPk(contact_id);
        return contact;
    } catch (error) {
        throw error;
    }
};

const findByPhone = async (phone) => {
    try {
        const contact = await User.findAll({
            where: {
                phone: phone,
            },
        });
        return contact;
    } catch (error) {
        throw error;
    }
};

const findSendInvitations = async (user_id) => {
    try {
        const contact = await Contact.findAll({
            where: {
                user_id: user_id,
                status: "pending",
            },
            include: [
                {
                    model: User,
                    as: "contactUser",
                    attributes: [
                        "user_id",
                        "username",
                        "full_name",
                        "avatar_url",
                    ],
                },
            ],
        });

        return contact;
    } catch (error) {
        throw error;
    }
};

const findInvitations = async (user_id) => {
    try {
        const contact = await Contact.findAll({
            where: {
                contact_user_id: user_id,
                status: "pending",
            },
            include: [
                {
                    model: User,
                    as: "owner",
                    attributes: [
                        "user_id",
                        "username",
                        "full_name",
                        "avatar_url",
                    ],
                },
            ],
        });

        return contact;
    } catch (error) {
        throw error;
    }
};

const findByUserIdAndContactUserId = async (user_id, contact_user_id) => {
    try {
        const contact = await Contact.findOne({
            where: {
                user_id: user_id,
                contact_user_id: contact_user_id,
            },
        });

        return contact;
    } catch (error) {
        throw error;
    }
};

const sendInvitations = async (user_id, contact_user_id) => {
    try {
        const contact = await Contact.create({
            user_id: user_id,
            contact_user_id: contact_user_id,
            status: "pending",
        });

        return contact;
    } catch (error) {
        throw error;
    }
};

const acceptInvitations = async (user_id, contact_user_id) => {
    try {
        const contact = await Contact.create({
            user_id: user_id,
            contact_user_id: contact_user_id,
            status: "accepted",
        });

        return contact;
    } catch (error) {
        throw error;
    }
};

const rejectInvitations = async (contact_id) => {
    try {
        return await Contact.destroy({
            where: {
                contact_id: contact_id,
            },
        });
    } catch (error) {
        throw error;
    }
};

const updateStatus = async (contact_id, status) => {
    try {
        return await Contact.update(
            {
                status: status,
            },
            {
                where: {
                    contact_id: contact_id,
                },
            },
        );
    } catch (error) {
        throw error;
    }
};

const ListFriends = async (user_id) => {
    try {
        const listFriends = await Contact.findAll({
            where: {
                user_id: user_id,
                status: "accepted",
            },
            include: [
                {
                    model: User,
                    as: "contactUser",
                    attributes: [
                        "user_id",
                        "username",
                        "full_name",
                        "avatar_url",
                    ],
                },
            ],
            order: [["created_at", "DESC"]],
        });

        return listFriends;
    } catch (error) {
        throw error;
    }
};

const removeInvitations = async (contact_id) => {
    try {
        return await Contact.destroy({
            where: {
                contact_id: contact_id,
            },
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findById,
    findByPhone,
    findByUserIdAndContactUserId,
    sendInvitations,
    updateStatus,
    acceptInvitations,
    rejectInvitations,
    ListFriends,
    findSendInvitations,
    findInvitations,
    removeInvitations
};
