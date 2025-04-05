import User from "../models/UserModel";




export const generateImage = async(req, res) => {
      try {
        const { userId , prompt } = req.body;

        const user = await User.findById(userId);
        if(!user || prompt)
            return res.status(411).json({
                success: false,
                message: "Missing details"
            })

            if(user.creditBalance === 0 || User.creditBalance < 0){
                return res.status(411).json({
                    success: false,
                    message: "No credit Balance",
                    creditBalance: user.creditBalance
                })
            }
        } catch(error){
            console.log(error.message)
            res.status(500).json({
                success: false,
                message: error.message
            })

        }

      }
    