import { connect, ConnectOptions } from 'mongoose';
import { MONGO_URI } from './config';

export const dbConnect = async () => {
    connect(MONGO_URI!, {
    } as ConnectOptions).then(
        () => {
            console.log("Database connected! => " + MONGO_URI!);
        },
        (err) => {
            console.log("Database connection failed: ", err);
        }
    );
}