import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { connectDb } from './configs/db.js';
import userRoute from './routes/userRoute.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRouter.js';
import creditsRouter from './routes/creditsRouter.js';
import { webhookStripe } from './controllers/webhook.js';

const app = express();

await connectDb()

// Stripe
app.post('/api/stripe', express.raw({ type: 'application/json' }), webhookStripe)

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server is Running"))
app.use('/api/user', userRoute);
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credits', creditsRouter)



const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is listening at PORT http://localhost:${PORT}`)
})