const authRouter = require('./authRoute');
const userRouter = require('./userRoute')
const contactRouter = require('./contactRoute')

const initRoutes = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter)
    app.use('/api/contact', contactRouter)
};

module.exports = initRoutes;