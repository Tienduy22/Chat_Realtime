const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Conversation = sequelize.define(
    "Conversation",
    {
        conversation_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        conversation_type: {
            type: DataTypes.ENUM("private", "group"),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
        },
        avatar_url: {
            type: DataTypes.STRING(500),
        },
        description: {
            type: DataTypes.TEXT,
        },
        created_by: {
            type: DataTypes.BIGINT,
        },
        is_archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "conversations",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Conversation;
