const authRouter = require('./authRoute');
const userRouter = require('./userRoute')
const contactRouter = require('./contactRoute')
const conversationRouter = require('./conversationRoute')

const initRoutes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter)
    app.use('/api/contact', contactRouter)
    app.use('/api/conversation', conversationRouter)
};

module.exports = initRoutes;