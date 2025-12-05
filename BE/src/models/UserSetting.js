const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserSetting = sequelize.define(
    "UserSetting",
    {
        setting_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
        },
        notification_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        sound_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        message_preview: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        online_status_visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        read_receipts_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        theme: {
            type: DataTypes.STRING(20),
            defaultValue: "light",
        },
        language: {
            type: DataTypes.STRING(10),
            defaultValue: "vi",
        },
    },
    {
        tableName: "user_settings",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = UserSetting;
