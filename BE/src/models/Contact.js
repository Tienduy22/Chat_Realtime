const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Contact = sequelize.define(
    "Contact",
    {
        contact_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        contact_user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "accepted", "blocked"),
            defaultValue: "pending",
        },
        nickname: {
            type: DataTypes.STRING(100),
        },
    },
    {
        tableName: "contacts",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [
            { fields: ["user_id"] },
            { fields: ["contact_user_id"] },
            { fields: ["status"] },
            { unique: true, fields: ["user_id", "contact_user_id"] },
        ],
    }
);

module.exports = Contact;
