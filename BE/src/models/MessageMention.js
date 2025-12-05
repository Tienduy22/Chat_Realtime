const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MessageMention = sequelize.define(
    "MessageMention",
    {
        mention_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        message_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        mentioned_user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        tableName: "message_mentions",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
        indexes: [
            { fields: ["message_id"] },
            { fields: ["mentioned_user_id"] },
            { unique: true, fields: ["message_id", "mentioned_user_id"] },
        ],
    }
);

module.exports = MessageMention;
