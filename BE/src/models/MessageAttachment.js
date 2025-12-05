const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MessageAttachment = sequelize.define(
    "MessageAttachment",
    {
        attachment_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        message_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        file_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        file_url: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        file_type: {
            type: DataTypes.STRING(50),
        },
        file_size: {
            type: DataTypes.BIGINT,
        },
        thumbnail_url: {
            type: DataTypes.STRING(500),
        },
        duration: {
            type: DataTypes.INTEGER,
        },
        width: {
            type: DataTypes.INTEGER,
        },
        height: {
            type: DataTypes.INTEGER,
        },
    },
    {
        tableName: "message_attachments",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
        indexes: [{ fields: ["message_id"] }],
    }
);

module.exports = MessageAttachment;
