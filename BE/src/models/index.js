const sequelize = require('../config/database');
const User = require('./User');
const Conversation = require('./Conversation');
const ConversationParticipant = require('./ConversationParticipant');
const Message = require('./Message');
const MessageAttachment = require('./MessageAttachment');
const MessageReaction = require('./MessageReaction');
const MessageReadReceipt = require('./MessageReadReceipt');
const Contact = require('./Contact');
const Notification = require('./Notification');
const UserSetting = require('./UserSetting');
const MessageMention = require('./MessageMention');
const BlockedUser = require('./BlockedUser');


// User - Conversation (created_by)
User.hasMany(Conversation, { foreignKey: 'created_by', as: 'createdConversations' });
Conversation.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// User - ConversationParticipant
User.hasMany(ConversationParticipant, { foreignKey: 'user_id', as: 'participations' });
ConversationParticipant.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Conversation - ConversationParticipant
Conversation.hasMany(ConversationParticipant, { foreignKey: 'conversation_id', as: 'participants' });
ConversationParticipant.belongsTo(Conversation, { foreignKey: 'conversation_id', as: 'conversation' });

// User - Message (sender)
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// Conversation - Message
Conversation.hasMany(Message, { foreignKey: 'conversation_id', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id', as: 'conversation' });

// Message - Message (parent/reply)
Message.hasMany(Message, { foreignKey: 'parent_message_id', as: 'replies' });
Message.belongsTo(Message, { foreignKey: 'parent_message_id', as: 'parentMessage' });

// Message - MessageAttachment
Message.hasMany(MessageAttachment, { foreignKey: 'message_id', as: 'attachments' });
MessageAttachment.belongsTo(Message, { foreignKey: 'message_id', as: 'message' });

// Message - MessageReaction
Message.hasMany(MessageReaction, { foreignKey: 'message_id', as: 'reactions' });
MessageReaction.belongsTo(Message, { foreignKey: 'message_id', as: 'message' });

// User - MessageReaction
User.hasMany(MessageReaction, { foreignKey: 'user_id', as: 'reactions' });
MessageReaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Message - MessageReadReceipt
Message.hasMany(MessageReadReceipt, { foreignKey: 'message_id', as: 'readReceipts' });
MessageReadReceipt.belongsTo(Message, { foreignKey: 'message_id', as: 'message' });

// User - MessageReadReceipt
User.hasMany(MessageReadReceipt, { foreignKey: 'user_id', as: 'readReceipts' });
MessageReadReceipt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User - Contact (owner)
User.hasMany(Contact, { foreignKey: 'user_id', as: 'contacts' });
Contact.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });

// User - Contact (contact)
User.hasMany(Contact, { foreignKey: 'contact_user_id', as: 'contactOf' });
Contact.belongsTo(User, { foreignKey: 'contact_user_id', as: 'contactUser' });

// User - Notification
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User - UserSetting
User.hasOne(UserSetting, { foreignKey: 'user_id', as: 'settings' });
UserSetting.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Message - MessageMention
Message.hasMany(MessageMention, { foreignKey: 'message_id', as: 'mentions' });
MessageMention.belongsTo(Message, { foreignKey: 'message_id', as: 'message' });

// User - MessageMention
User.hasMany(MessageMention, { foreignKey: 'mentioned_user_id', as: 'mentions' });
MessageMention.belongsTo(User, { foreignKey: 'mentioned_user_id', as: 'mentionedUser' });

// User - BlockedUser (blocker)
User.hasMany(BlockedUser, { foreignKey: 'blocker_user_id', as: 'blockedUsers' });
BlockedUser.belongsTo(User, { foreignKey: 'blocker_user_id', as: 'blocker' });

// User - BlockedUser (blocked)
User.hasMany(BlockedUser, { foreignKey: 'blocked_user_id', as: 'blockedBy' });
BlockedUser.belongsTo(User, { foreignKey: 'blocked_user_id', as: 'blockedUser' });

module.exports = {
  sequelize,
  User,
  Conversation,
  ConversationParticipant,
  Message,
  MessageAttachment,
  MessageReaction,
  MessageReadReceipt,
  Contact,
  Notification,
  UserSetting,
  MessageMention,
  BlockedUser
};