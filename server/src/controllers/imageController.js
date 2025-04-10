import dotenv from 'dotenv'
dotenv.config();
import User from "../models/UserModel.js";
import FormData from "form-data";
import axios from 'axios';



const API_KEY= process.env.API_KEY;


export const generateImage = async(req, res) => {
      try {
        const { prompt } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if(!user || !prompt)
            return res.status(411).json({
                success: false,
                message: "Missing details"
            })

            if(user.creditBalance === 0 || user.creditBalance < 0){
                return res.status(411).json({
                    success: false,
                    message: "No credit Balance",
                    creditBalance: user.creditBalance
                })
            }
            const formData = new FormData()
            formData.append('prompt', prompt)
            const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, 
               {
                 headers:{
                    "x-api-key": API_KEY
                 },
                  responseType: 'arraybuffer'
                })

                const base64Image = Buffer.from(data, 'binary').toString('base64')
                const resultImage = `data:image/png;base64,${base64Image}`

                await User.findByIdAndUpdate(user._id, {creditBalance: user.creditBalance-1})
                res.json({
                    success: true,
                    message: "Image Generated", 
                    creditBalance: user.creditBalance-1,
                    resultImage
                })

            } catch(error){
             console.log('Error generating image: ', error.response?.data || error.message);
             res.status(500).json({
                success: false,
                message: error.response?.data || error.message,
            });

        }

      }
    