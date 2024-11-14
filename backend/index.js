// packages
import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

// Utiles
import ConnetDB from './config/db.js'
import userRoutes from './routers/user.routes.js'
import categoryRoutes from './routers/category.routes.js'
import productRoutes from './routers/product.routes.js'
import uploadRoutes from './routers/upload.routes.js'

dotenv.config();
const port = process.env.PORT || 5000;

ConnetDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// app.get('/', (req, res) => {
//     res.send("Hello World")
// })

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname + '/uploads')))

app.listen(port, () => console.log(`Server running on port: ${port}`));