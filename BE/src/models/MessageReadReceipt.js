const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const MessageReadReceipt = sequelize.define(
    "MessageReadReceipt",
    {
        receipt_id: {
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
        read_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "message_read_receipts",
        timestamps: false,
        indexes: [
            { fields: ["message_id"] },
            { fields: ["user_id"] },
            { unique: true, fields: ["message_id", "user_id"] },
        ],
    }
);

module.exports = MessageReadReceipt;
