const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define(
    "Notification",
    {
        notification_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM(
                "message",
                "mention",
                "reaction",
                "friend_request",
                "group_invite",
                "system"
            ),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
        },
        content: {
            type: DataTypes.TEXT,
        },
        reference_id: {
            type: DataTypes.BIGINT,
        },
        reference_type: {
            type: DataTypes.STRING(50),
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "notifications",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
        indexes: [
            { fields: ["user_id"] },
            { fields: ["is_read"] },
            { fields: ["created_at"] },
        ],
    }
);

module.exports = Notification;
