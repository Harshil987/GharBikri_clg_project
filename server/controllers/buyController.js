const{ prisma }  = require("../config/parismaConfig");
// get all properties which have status of buy
const getBuy = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        p_listingType: 'Buy',
      },
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
    res.status(200).json({ property: properties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// get all properties which have status of buy and filter according to the price range, city, and type
const getBuyFilter = async (req, res) => {
  try {
    const { minPrice, maxPrice, city, type } = req.query;
const properties = await prisma.property.findMany({
  where: {
    p_listingType: 'Buy',
    p_price: {
      gte: parseInt(minPrice),
      lte: parseInt(maxPrice),
    },
    p_address_city: city,
    p_type: type,
  },
      select: {
        p_id: true,
        p_name: true,
        p_address_street_num: true,
        p_address_street_name: true,
        p_address_city: true,
        p_address_state: true,
        user_id: true,
        p_description: true,
        p_type: true,
        p_bed: true,
        p_bath: true,
        p_area_sq_ft: true,
        p_repair_quality: true,
        p_year: true,
        p_price: true,
        p_listingType: true,
        p_availability_status: true,
      },
    });
    res.status(200).json({ property: properties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// get individual property after clicking on it
const getBuyId = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: {
        p_id: parseInt(id),
      },
      select: {
        p_id: true,
        p_name: true,
        p_address_street_num: true,
        p_address_street_name: true,
        p_address_city: true,
        p_address_state: true,
        user_id: true,
        p_description: true,
        p_type: true,
        p_bed: true,
        p_bath: true,
        p_area_sq_ft: true,
        p_repair_quality: true,
        p_year: true,
        p_price: true,
        p_listingType: true,
        p_availability_status: true,
      },
    });
    res.status(200).json({ property: property });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBuy,
  getBuyFilter,
  getBuyId,
};
