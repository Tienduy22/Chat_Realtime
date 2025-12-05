const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define(
    "Message",
    {
        message_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        conversation_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        sender_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        message_type: {
            type: DataTypes.ENUM(
                "text",
                "image",
                "video",
                "audio",
                "file",
                "location",
                "system"
            ),
            defaultValue: "text",
        },
        content: {
            type: DataTypes.TEXT,
        },
        parent_message_id: {
            type: DataTypes.BIGINT,
        },
        is_edited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deleted_at: {
            type: DataTypes.DATE,
        },
    },
    {
        tableName: "messages",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [{ fields: ["conversation_id", "created_at"] }],
    }
);

module.exports = Message;
