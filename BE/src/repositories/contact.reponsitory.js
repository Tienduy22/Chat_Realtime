const { User, Contact } = require("../models");
const { Op } = require("sequelize");

const findById = async (contact_id) => {
    try {
        const contact = await Contact.findByPk(contact_id);
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
            }
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
                    as: 'contactUser',
                    attributes: ['user_id', 'username', 'full_name', 'avatar_url']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return listFriends
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findById,
    findByUserIdAndContactUserId,
    sendInvitations,
    updateStatus,
    acceptInvitations,
    rejectInvitations,
    ListFriends,
};
