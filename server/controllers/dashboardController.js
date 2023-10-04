const bcrypt = require('bcrypt');
const{ prisma }  = require("../config/parismaConfig");

exports.getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        user_email: true,
        created_at: true,
        updated_at: true,
        phone_number: true,
        address_city: true,
        address_state: true,
        property_count: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

// edit user with matching id if authorized
exports.editUser = async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        user_email,
        phone_number,
        address_city,
        address_state,
      } = req.body;
  
      const email = await prisma.user.findFirst({
        where: {
          user_email: user_email,
          id: { not: req.user },
        },
      });
  
      if (email) {
        return res.status(401).json({
          success: false,
          message: 'Email already in use',
        });
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: req.user },
        data: {
          first_name,
          last_name,
          user_email,
          updated_at: new Date(),
          phone_number,
          address_city,
          address_state,
        },
      });
  
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
// delete user with matching id if authorized
exports.deleteUser = async (req, res) => {
    try {
      const properties = await prisma.property.findMany({
        where: { user_id: req.user },
        select: { p_id: true },
      });
  
      for (const property of properties) {
        await prisma.property.delete({
          where: { p_id: property.p_id },
        });
      }
  
      await prisma.user.delete({
        where: { id: req.user },
      });
  
      res.status(200).json({
        success: true,
        message: 'User deleted',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
// change password if authorized and if the old password is correct
// old password should not be the same as the new password
exports.changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
  
      const user = await prisma.user.findUnique({
        where: { id: req.user },
        select: { password: true },
      });
  
      const validPassword = await bcrypt.compare(oldPassword, user.password);
  
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
      const updatedUser = await prisma.user.update({
        where: { id: req.user },
        data: {
          password: hashedPassword,
          updated_at: new Date(),
        },
      });
  
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
// get all properties of user with matching id from params if authorized
// This is for the dashboard to show property cards
exports.getUserProperties = async (req, res) => {
    try {
      const userId = req.user; // Assuming req.user contains the user ID
      const properties = await prisma.property.findMany({
        where: { user_id:  userId  },
        select: {
          p_id: true,
          p_name: true,
          p_address_street_num: true,
          p_address_street_name: true,
          p_address_city: true,
          p_address_state: true,
          p_bed: true,
          p_bath: true,
          p_area_sq_ft: true,
          p_price: true,
          p_listingType: true,
          p_frontal_image: true,
        },
      });
  
      res.json(properties);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
// get property with matching id
// This is for the property expanded view
exports.getProperty = async (req, res) => {
    try {
      const property = await prisma.property.findUnique({
        where: { p_id: req.params.id },
        select: {
          p_name: true,
          p_address_street_num: true,
          p_address_street_name: true,
          p_address_city: true,
          p_address_state: true,
          p_description: true,
          p_type: true,
          p_bed: true,
          p_bath: true,
          p_area_sq_ft: true,
          p_repair_quality: true,
          p_year: true,
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              user_email: true,
              phone_number: true,
            },
          },
          p_price: true,
          p_listingType: true,
          p_frontal_image: true,
          p_availability_status: true,
          created_at: true,
          updated_at: true,
          p_views: true,
        },
      });
  
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found',
        });
      }
  
      const result = {
        ...property,
        owner_id: property.user.user_id,
        owner_first_name: property.user.first_name,
        owner_last_name: property.user.last_name,
        owner_email: property.user.user_email,
        owner_phone_number: property.user.phone_number,
      };
  
      if (result.owner_id !== req.user) {
        const p_views = result.p_views + 1;
        await prisma.property.update({
          where: { p_id: req.params.id },
          data: { p_views },
        });
      }
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
// edit property with matching id if authorized
exports.editProperty = async (req, res) => {
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
  
      const updatedProperty = await prisma.property.update({
        where: { p_id: req.params.id, user_id: req.user },
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
          updated_at: new Date(),
        },
      });
  
      res.json(updatedProperty);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
// delete property with matching id if authorized
exports.deleteProperty = async (req, res,) => {
    try {
      const property = await prisma.property.findUnique({
        where: { p_id: req.params.id, user_id: req.user },
        select: { p_frontal_image: true },
      });
  
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found',
        });
      }
  
      // Delete the frontal image from the file system if needed
      // fs.unlinkSync(`../../../client/src/assets/uploads/${property.p_frontal_image}`);
  
      const deletedProperty = await prisma.property.delete({
        where: { p_id: req.params.id, user_id: req.user },
      });
  
      // Fetch the current user's property count
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user },
        select: { property_count: true },
      });
  
      if (currentUser) {
        // Decrement the property count and update the user
        await prisma.user.update({
          where: { id: req.user },
          data: {
            property_count: currentUser.property_count - 1,
          },
        });
      }
  
      res.json(deletedProperty);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  