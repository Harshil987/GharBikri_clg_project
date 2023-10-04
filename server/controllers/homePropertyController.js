const{ prisma }  = require("../config/parismaConfig");

const getPropertyHome = async (req, res) => {
  try {
    const { user_id, listingtype } = req.query;


    const properties = await prisma.property.findMany({
        where: {
            p_listingType: listingtype,
            user_id: {
              not: user_id, // Use not to exclude properties where user_id is not equal to the provided user_id
            },
          },
      take: 3, // Limit to 3 random properties
      orderBy: {
        p_id: 'asc', // Ascending order by p_id
    }, // Order randomly
      select: {
        p_id: true,
        p_name: true,
        p_address_street_num: true,
        p_address_street_name: true,
        p_address_city: true,
        p_address_state: true,
        user_id: true,
        p_bed: true,
        p_bath: true,
        p_area_sq_ft: true,
        p_price: true,
        p_listingType: true,
        p_frontal_image: true,
      },
    });

    res.status(200).json({
      property: properties,
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
  getPropertyHome,
};
