const asyncHandler = require("express-async-handler");

const createUser = async (req, res) => {
    console.log("Creating user..");
    let { email } = req.body;
    console.log(email);
};

module.exports = createUser;
