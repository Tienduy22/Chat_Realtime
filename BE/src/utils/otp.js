const otpStore = new Map();

const saveOTP = (email, otp) => {
    otpStore.set(email, {
        otp,
        expires: Date.now() + 5 * 60 * 1000,
    });
};

const verifyOTP = (email, otp) => {
    const record = otpStore.get(email);

    if (!record) return false;

    if (Date.now() > record.expires) {
        otpStore.delete(email);
        return false;
    }

    if (record.otp !== otp) return false;

    otpStore.delete(email);
    return true;
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    saveOTP,
    verifyOTP,
    generateOTP,
};
