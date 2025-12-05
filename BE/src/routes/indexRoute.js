const authRouter = require('./authRoute');

const initRoutes = (app) => {
    app.use('/api/auth', authRouter);
};

module.exports = initRoutes;