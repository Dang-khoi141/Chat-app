const express = require('express');
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route');

const cors = require('cors')
const cookieParser = require('cookie-parser')

const PORT=3000;
const app = express();
const dotenv = require('dotenv');

const {connectDB} = require('./config/datavase')

dotenv.config();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// xu ly cong ko the goi api

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
})
);

// xu ly kich thuoc anh 
// Thêm vào sau dòng app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);


app.listen(PORT,()=>{
    console.log(`server running Port: ${PORT}`);
    connectDB();
})