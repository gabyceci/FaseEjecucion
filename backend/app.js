//importo todo lo de la libreria de express
import express from "express";
import clientsRoutes from "./src/routes/clients.js";
import employeesRoutes from "./src/routes/employees.js"
import moviesRoutes from "./src/routes/movies.js"
import loginRoutes from './src/routes/login.js'
import registerClientsRoutes from './src/routes/registerClients.js'
import logoutRoutes from './src/routes/logout.js'
import registerEmployeeRoutes from './src/routes/registerEmployees.js'
import recoveryPasswordRoutes from './src/routes/recoveryPassword.js'

import cookieParser from "cookie-parser";


//crear constante que es igual a la libreria que importe
const app = express();

//Que acepte datos de json
app.use(express.json());
//Que postman acepte guardar cookies
app.use(cookieParser())

app.use("/api/clients", clientsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/movies", moviesRoutes)
app.use("/api/login", loginRoutes)
app.use("/api/logout", logoutRoutes)
app.use("/api/registerClients", registerClientsRoutes)
app.use("/api/registerEmployees", registerEmployeeRoutes)
app.use("/api/recoveryPassword", recoveryPasswordRoutes)






export default app;
