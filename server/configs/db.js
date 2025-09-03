import mongoose from "mongoose";
import "dotenv/config"

export const connectDb = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("✅ Database Connected");
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ Database Connection Error:", err.message);
        });

        await mongoose.connect(`${process.env.MONGODB_URL}`);


    } catch (error) {
        console.error(`❌ Database Connection Failed: ${error.message}`);
    }
};
