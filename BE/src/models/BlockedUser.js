const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BlockedUser = sequelize.define(
    "BlockedUser",
    {
        block_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        blocker_user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        blocked_user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        tableName: "blocked_users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
        indexes: [
            { fields: ["blocker_user_id"] },
            { fields: ["blocked_user_id"] },
            { unique: true, fields: ["blocker_user_id", "blocked_user_id"] },
        ],
    }
);

module.exports = BlockedUser;
