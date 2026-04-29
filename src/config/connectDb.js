import mongoose from "mongoose";
import logger from "./logger.js";
const connectDb = async () => {
    try {

        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.log('connection failed', error);
    }
}

export default connectDb;

        const connection = await mongoose.connect(process.env.DB_URL)
        logger.info(`MongoDB Connected: ${connection.connection.host}`)
    } catch (error) {
        logger.error(error.message, error);
    }
}

export default connectDb
 749d595f74bf2565bf288bd34372ccf3683450c7
