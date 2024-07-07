import express from 'express'
import { connection } from './database/connection.js'
import cors from 'cors'
import { globaleResponse } from './src/middlewares/error-handling.middleware.js'
import { config } from "dotenv";
import userRouter from './src/modules/user/user.routes.js'
import jobRouter from './src/modules/job/job.routes.js'
import companyRouter from './src/modules/company/company.routes.js'


const app = express()

if (process.env.NODE_ENV == "dev") {
    config({ path: path.resolve(".env") });
}
config();

const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use('/user', userRouter)
app.use('/job', jobRouter)
app.use('/company', companyRouter)

app.use(globaleResponse);
connection()
app.listen(port, ()=>{console.log(`Server is running on port ${port}`)})