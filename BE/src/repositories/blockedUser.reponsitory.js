const { User, BlockedUser } = require("../models");

const blockFriend = async (user_id, friend_id) => {
    try {
        return await BlockedUser.create({
            blocker_user_id: user_id,
            blocked_user_id: friend_id,
        });
    } catch (error) {
        throw error;
    }
};

const unBlockFriend = async (block_id) => {
    try {
        return await BlockedUser.destroy({
            where: {
                block_id: block_id,
            }
        });
    } catch (error) {
        throw error;
    }
};

const findBlock = async (user_id, friend_id) => {
    try {
        const block = await BlockedUser.findOne({
            where: {
                blocker_user_id: user_id,
                blocked_user_id: friend_id,
            },
        });

        return block;
    } catch (error) {
        throw error;
    }
};

const listBlocked = async (user_id) => {
    try {
        const listBlocked = await BlockedUser.findAll({
            where: {
                blocker_user_id: user_id,
            },
            include: [
                {
                    model: User,
                    as: "blocked",
                    attributes: ["user_id", "username", "full_name", "avatar_url"],
                },
            ],
            order: [["created_at", "DESC"]],
        });

        return listBlocked;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    blockFriend,
    unBlockFriend,
    findBlock,
    listBlocked,
};
