import express from 'express';
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import userRoutes from './routes/userRoutes.js'


const app = express();

//middleware
app.use(cors());
app.use(express.json());


//Routes
app.use('/auth', authRoutes)
app.use('/message', messageRoutes)
app.use('/user', userRoutes)

//Default route for testing
app.get('/' , (req,res)=>{
    res.send('Chat App API is running');
});

export default app;