const { sequelize } = require('../src/models');

const syncDatabase = async () => {
  try {
    console.log('Đang kết nối database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('Kết nối database thành công!');
    
    // Sync models
    // force: true -> DROP và tạo lại tables (chỉ dùng khi dev)
    // alter: true -> ALTER tables để match models (an toàn hơn)
    await sequelize.sync({ 
      force: process.env.DB_FORCE_SYNC === 'true',
      alter: process.env.DB_ALTER_SYNC === 'true'
    });
    
    console.log('Database đã được sync thành công!');
    console.log('Các bảng đã được tạo:');
    console.log('   - users');
    console.log('   - conversations');
    console.log('   - conversation_participants');
    console.log('   - messages');
    console.log('   - message_attachments');
    console.log('   - message_reactions');
    console.log('   - message_read_receipts');
    console.log('   - contacts');
    console.log('   - notifications');
    console.log('   - user_settings');
    console.log('   - message_mentions');
    console.log('   - blocked_users');
    
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi sync database:', error);
    process.exit(1);
  }
};

syncDatabase();