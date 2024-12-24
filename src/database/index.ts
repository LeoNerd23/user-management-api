import mongoose from 'mongoose';

const dbconnect = () => {
  mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to the database'))
  .catch(() => console.log('Error connecting to database'))
}

export default dbconnect;
