const{ prisma }  = require("../config/parismaConfig");

// get all properties which have listingtype of rent
// donot get properties posted by current logged in user if any user is logged in
const getRent = async (req, res) => {
  try {
    const uid = req.user;

    const getRent = async (req, res) => {
      try {
        const uid = req.user;
    
        const properties = await prisma.property.findMany({
          where: {
            p_listingType: 'Rent',
            user_id: {
              not: uid,
            },
          },
        });
    
        // Filter out the user's own properties
        const filteredProperties = properties.filter(property => property.user_id !== uid);
    
        res.json({
          property: filteredProperties,
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