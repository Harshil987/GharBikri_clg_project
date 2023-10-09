const { prisma } = require("../config/parismaConfig");

// Get all properties for rent except those posted by the current logged-in user
const getRent = async (req, res) => {
  try {
    const { user_id } = req.query;

    const properties = await prisma.property.findMany({
      where: {
        p_listingType: 'Rent',
        user_id: {
          not: user_id,
        },
      },
    });

    res.json({
      properties
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  getRent,
};

  
  module.exports = {
    getRent,
  };