const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ConversationParticipant = sequelize.define(
    "ConversationParticipant",
    {
        participant_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        conversation_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("admin", "moderator", "member"),
            defaultValue: "member",
        },
        joined_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        left_at: {
            type: DataTypes.DATE,
        },
        is_muted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_pinned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        last_read_message_id: {
            type: DataTypes.BIGINT,
        },
        unread_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "conversation_participants",
        timestamps: false,
        indexes: [{ fields: ["conversation_id", "user_id"], unique: true }],
    }
);

module.exports = ConversationParticipant;
