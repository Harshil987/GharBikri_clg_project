const bcrypt = require('bcrypt')
const jwtGenerator = require('../utils/jwtGenerator')
const{ prisma }  = require("../config/parismaConfig");  

exports.getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                first_name: true,
                last_name: true,
                user_email: true,
                phone_number: true,
                address_city: true,
                address_state: true,
                property_count: true,
                created_at: true,
                updated_at: true,
            },
        });

        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    } finally {
        await prisma.$disconnect();
    }
};

// register controller
exports.register = async (req, res) => {
    // Destructure the req.body
    const {
        first_name,
        last_name,
        user_email,
        password,
        phone_number,
        address_city,
        address_state,
        
    } = req.body;

    try {
        // Check if user_email already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                user_email: user_email,
            },
        });

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: 'User already exists',
            });
        }

        // Bcrypt to hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        if (!hashedPassword) {
            return res.status(401).json({
                success: false,
                message: 'Error hashing password',
            });
        }

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                first_name,
                last_name,
                user_email,
                password: hashedPassword,
                phone_number,
                address_city,
                address_state,
                property_count:0
            },
        });

        // Generate JWT token
        const token = jwtGenerator(newUser.id);
        const user_id = newUser.id;
        res.json({ token, user_id});

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    } finally {
        await prisma.$disconnect();
    }
};

// login controller
exports.login = async (req, res) => {
    try {
        // Destructure the req.body
        const { user_email, password } = req.body;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                user_email: user_email,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if the password is correct
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate and return the JWT token
        const token = jwtGenerator(user.id);
        const user_id = user.id;

        res.json({ token, user_id});

        // For cookie-based authentication
        // return res.status(200).cookie('token', token, { httpOnly: true }).json({
        //     success: true,
        //     message: 'Logged in successfully',
        // });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    } finally {
        await prisma.$disconnect();
    }
};

exports.isVerify = async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// logout token based authentication
exports.logout = async (req, res) => {
    try {
        // To implement token-based logout, you can clear the JWT token cookie.
        // Assuming you've set the token as a cookie named 'token'.
        res.clearCookie('token').json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
