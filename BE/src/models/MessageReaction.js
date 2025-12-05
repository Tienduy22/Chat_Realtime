const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MessageReaction = sequelize.define(
    "MessageReaction",
    {
        reaction_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        message_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        emoji: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
    },
    {
        tableName: "message_reactions",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
        indexes: [
            { fields: ["message_id"] },
            { fields: ["user_id"] },
            { unique: true, fields: ["message_id", "user_id", "emoji"] },
        ],
    }
);

module.exports = MessageReaction;
