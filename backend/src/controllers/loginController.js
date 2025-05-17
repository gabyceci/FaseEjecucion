import clientsModel from "../models/Clients.js"
import employeesModel from "../models/Employees.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import { config } from "../config.js"


const loginController = {};

loginController.login = async (req, res) => {
    const { email, password } = req.body;

    try {

        let userFound;
        let userType;

        if (email === config.ADMIN.emailAdmin && password === config.ADMIN.password) {
            userType = "admin";
            userFound = { _id: "admin" }
        } else {
            userFound = await employeesModel.findOne({ email });
            userType = "employee"
            if (!userFound) {
                userFound = await clientsModel.findOne({ email });
                userType = "client"
            }
        }
        if (!userFound) {
            return res.json({ message: "User not found" });
        }

      

        if (userType !== "admin") {
            const isMatch = await bcryptjs.compare(password, userFound.password);
            if (!isMatch) {
                return res.json({ message: "Invalid password" })
            }
        }


        //TOKEN
        jsonwebtoken.sign(
            //1 que voy a guardar
            { id: userFound._id, userType },
            //2- secreto
            config.JWT.secret,
            //3- Cuando expira
            { expiresIn: config.JWT.expiresIn },
            //4- Funcion flecha
            (error, token) => {
                if (error) console.log("error" + error)

                res.cookie("authToken", token)
                res.json({ message: "Login successful" })
            } 
        )

    } catch (error) {
        console.log("error" + error)
        res.json({ message: "Error login" })
    }
};


export default loginController;