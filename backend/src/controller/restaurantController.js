import { StatusCodes } from 'http-status-codes';
import { cloudinaryInstance } from '../config/cloudinaryConfig.js';
import { Restaurant } from '../model/restaurantModel.js';


export const createRestaurant = async(req, res)=>{
    console.log("hitting");
    try {
        if(!req.file){
            return res.status(StatusCodes.CONFLICT).json({success: false, message: 'No file uploaded'});
        }
        cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
            if (err) {
              console.log(err, "error");
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error",
              });
            }

            const imageUrl = result.url;
           console.log(imageUrl);
            const {name, location, openingHours, cuisineType} = req.body;
      
            const newRestaurant = new Restaurant({
               name,
               location,
               openingHours,
               cuisineType,
               image : imageUrl,
            });
            await newRestaurant.save();
            
            if (!newRestaurant) {
              return res.status(StatusCodes.CONFLICT).json({message:"Restaurant not created"});
            }
            res.status(StatusCodes.CREATED).json({ message: "Restaurant created successfully"});
          });        
    } catch (error) {
        console.log("Error while adding restaurant", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });  
    }
}

export const getAllRestaurants = async(req, res)=>{
    try {

        const allRestaurant = await Restaurant.find();
        return res.status(StatusCodes.OK).json({allRestaurant});
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"});
    }
}

export const getRestaurantById = async(req, res)=>{
    const {restaurantId} = req.params

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: 'Restaurant not found' });
        }
        res.status(StatusCodes.OK).json({ restaurant });
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch restaurant' });   
    }
}

export const deleteRestaurant = async (req, res) => {
    const { restaurantId } = req.params;
  
    try {
      const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);
  
      if (!deletedRestaurant) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Restaurant not found' });
      }
  
      res.status(StatusCodes.OK).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete restaurant' });
    }
  };