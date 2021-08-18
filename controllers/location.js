import Location from "../models/location.js";


export const getNearMe = async (req, res) => {

    const { userType, latitude, longitude, userId } = req.query;

    let singleUsers = [];
    let groupUsers = [];

    const loc_query = {
        "location": {
            $near: {
                $maxDistance: 16093.4,
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                }
            }
        }
    }


    try {

        const userLocations = await Location.find(loc_query)
            .populate('user', 'phoneNumber userType name profile', 'User', { userType })
            .populate('chatRoom','roomName participants')
            .exec();

        const userLength = userLocations.length;

        for (let i = 0; i < userLength; i++) {

            if(userLocations[i].chatType === 'SINGLE'){
                if (userLocations[i].user !== null && userLocations[i].user._id != userId) {
                    singleUsers.push(userLocations[i]);
                }
            }
            else{
                groupUsers.push(userLocations[i]);
            }

           


        }


        return res.status(201).send({ singleUsers,groupUsers });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}