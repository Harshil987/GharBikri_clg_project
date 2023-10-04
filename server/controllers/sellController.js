const{ prisma }  = require("../config/parismaConfig");

const postProperty = async (req, res) => {
  try {
    const {
      p_name,
      p_address_street_num,
      p_address_street_name,
      p_address_city,
      p_address_state,
      p_description,
      p_type,
      p_bed,
      p_bath,
      p_area_sq_ft,
      p_repair_quality,
      p_year,
      p_price,
      p_listingType,
      p_availability_status,
      p_frontal_image,
      
    } = req.body;

    const user = req.user;

    const currentUser = await prisma.user.findUnique({
        where: { id: user },
        select: { property_count: true },
      });
  
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      const userPropertyCount = currentUser.property_count;

    const newProperty = await prisma.property.create({
      data: {
        p_name,
        p_address_street_num,
        p_address_street_name,
        p_address_city,
        p_address_state,
        p_description,
        p_type,
        p_bed,
        p_bath,
        p_area_sq_ft,
        p_repair_quality,
        p_year,
        p_price,
        p_listingType,
        p_availability_status,
        p_frontal_image,
        user: {
          connect: { id: user },
        },
      },
    });

    await prisma.user.update({
        where: { id: user },
        data: {
          property_count: userPropertyCount + 1,
        },
      });
  

    const property_id = newProperty.p_id;

    res.status(200).json({
      success: true,
      message: 'Property posted successfully',
      property_id: property_id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  postProperty,
};
