const jwt = require('jsonwebtoken');
const { JWT } = require('../constants');

function jwtGenerator(user_id) {
    const payload = {
        user: user_id
    }

    return jwt.sign(payload, JWT.JWT_SECRET);
}

module.exports = jwtGenerator;