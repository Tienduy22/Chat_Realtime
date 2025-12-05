const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "User",
    {
        user_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true, 
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true, 
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        full_name: {
            type: DataTypes.STRING(100),
        },
        avatar_url: {
            type: DataTypes.STRING(500),
        },
        phone: {
            type: DataTypes.STRING(20),
        },
        bio: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.ENUM("online", "offline", "away", "busy"),
            defaultValue: "offline",
        },
        last_seen: {
            type: DataTypes.DATE,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = User;
