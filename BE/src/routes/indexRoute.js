const authRouter = require('./authRoute');
const userRouter = require('./userRoute')
const contactRouter = require('./contactRoute')
const conversationRouter = require('./conversationRoute')
const messageRouter = require('./messageRoute')

const initRoutes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter)
    app.use('/api/contact', contactRouter)
    app.use('/api/conversation', conversationRouter)
    app.use('/api/message', messageRouter)
};

module.exports = initRoutes;