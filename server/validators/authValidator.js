const { check } = require('express-validator');
const { compare } = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// registration check

// check password
const password = check('password')
    .isLength({ min: 6, max: 15 })
    .withMessage('Password has to be between 6 and 15 characters')
    .isAlphanumeric()
    .withMessage('Password needs to contain alphanumeric characters');

// email validation and
// check if email already exists
const email = check('user_email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail()
    .custom(async (value) => {
        const existingUser = await prisma.user.findUnique({
            where: {
                user_email: value, // Replace 'value' with the actual email you're searching for
            },
        });
        if (existingUser) {
            throw new Error('Email already in use');
        }
    });

// check if first name is entered or not and if it is already in use
const first_name = check('first_name')
    .isLength({ min: 3 })
    .withMessage('Please enter a valid first name.');

// check if last name is entered or not
const last_name = check('last_name')
    .isLength({ min: 3 })
    .withMessage('Please enter a valid last name.');

const phone_number = check('phone_number')
    .isLength({ min: 10, max: 10 })
    .withMessage('Please enter a valid phone number.');

const address_city = check('address_city')
    .isLength({ min: 3 })
    .withMessage('Please enter a valid address city.');

const address_state = check('address_state')
    .isLength({ min: 2 })
    .withMessage('Please enter a valid address state.');

    const loginFieldCheck = check('user_email')
    .custom(async (value, { req }) => {
        const user = await prisma.user.findUnique({
            where: {
                user_email: value, // Replace 'value' with the actual email you're searching for
            },
        });
        if (!user) {
            throw new Error('Email not found');
        }

        const isMatch = await compare(req.body.password, user.password);
        if (!isMatch) {
            throw new Error('Password is incorrect');
        }

        req.user = user;

        return true; // Indicates validation success
    });



module.exports = {
    registerValidation: [password, email, first_name, last_name, phone_number, address_city, address_state],
    loginValidation: [loginFieldCheck],
}