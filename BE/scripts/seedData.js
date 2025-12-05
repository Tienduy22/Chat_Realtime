const {
    User,
    Conversation,
    ConversationParticipant,
    Message,
    Contact,
    UserSetting,
} = require("../src/models");

const seedData = async () => {
    try {
        console.log("Đang seed data mẫu...");

        // Tạo users mẫu
        const users = await User.bulkCreate([
            {
                username: "john_doe",
                email: "john@example.com",
                password_hash: "123456",
                full_name: "John Doe",
                bio: "Software Developer",
                status: "online",
            },
            {
                username: "jane_smith",
                email: "jane@example.com",
                password_hash: "123456",
                full_name: "Jane Smith",
                bio: "Designer",
                status: "online",
            },
            {
                username: "bob_wilson",
                email: "bob@example.com",
                password_hash: "123456",
                full_name: "Bob Wilson",
                bio: "Product Manager",
                status: "offline",
            },
        ]);

        console.log(`Đã tạo ${users.length} users`);

        // Tạo user settings cho mỗi user
        for (const user of users) {
            await UserSetting.create({ user_id: user.user_id });
        }

        console.log("Đã tạo user settings");

        // Tạo contacts (bạn bè)
        await Contact.bulkCreate([
            {
                user_id: users[0].user_id,
                contact_user_id: users[1].user_id,
                status: "accepted",
            },
            {
                user_id: users[1].user_id,
                contact_user_id: users[0].user_id,
                status: "accepted",
            },
            {
                user_id: users[0].user_id,
                contact_user_id: users[2].user_id,
                status: "pending",
            },
        ]);

        console.log("Đã tạo contacts");

        // Tạo private conversation
        const privateConv = await Conversation.create({
            conversation_type: "private",
            created_by: users[0].user_id,
        });

        await ConversationParticipant.bulkCreate([
            {
                conversation_id: privateConv.conversation_id,
                user_id: users[0].user_id,
                role: "member",
            },
            {
                conversation_id: privateConv.conversation_id,
                user_id: users[1].user_id,
                role: "member",
            },
        ]);

        // Tạo messages trong private chat
        await Message.bulkCreate([
            {
                conversation_id: privateConv.conversation_id,
                sender_id: users[0].user_id,
                message_type: "text",
                content: "Hey Jane! How are you?",
            },
            {
                conversation_id: privateConv.conversation_id,
                sender_id: users[1].user_id,
                message_type: "text",
                content: "Hi John! I am good, thanks!",
            },
        ]);

        console.log("✅ Đã tạo private conversation với messages");

        // Tạo group conversation
        const groupConv = await Conversation.create({
            conversation_type: "group",
            name: "Team Project",
            description: "Discussion for our new project",
            created_by: users[0].user_id,
        });

        await ConversationParticipant.bulkCreate([
            {
                conversation_id: groupConv.conversation_id,
                user_id: users[0].user_id,
                role: "admin",
            },
            {
                conversation_id: groupConv.conversation_id,
                user_id: users[1].user_id,
                role: "member",
            },
            {
                conversation_id: groupConv.conversation_id,
                user_id: users[2].user_id,
                role: "member",
            },
        ]);

        await Message.create({
            conversation_id: groupConv.conversation_id,
            sender_id: users[0].user_id,
            message_type: "system",
            content: "John Doe created the group",
        });

        console.log("Đã tạo group conversation");

        console.log("Seed data hoàn thành!");
        process.exit(0);
    } catch (error) {
        console.error("Lỗi khi seed data:", error);
        process.exit(1);
    }
};

seedData();
