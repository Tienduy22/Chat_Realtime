const { sequelize } = require("../src/models");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const resetDatabase = async () => {
    rl.question(
        "BẠN CHẮC CHẮN MUỐN XÓA TẤT CẢ DATA? (yes/no): ",
        async (answer) => {
            if (answer.toLowerCase() === "yes") {
                try {
                    console.log("Đang reset database...");

                    await sequelize.sync({ force: true });

                    console.log("Database đã được reset thành công!");
                    console.log('Chạy "npm run seed" để tạo data mẫu');

                    process.exit(0);
                } catch (error) {
                    console.error("Lỗi khi reset database:", error);
                    process.exit(1);
                }
            } else {
                console.log("Đã hủy reset database");
                process.exit(0);
            }

            rl.close();
        }
    );
};

resetDatabase();
