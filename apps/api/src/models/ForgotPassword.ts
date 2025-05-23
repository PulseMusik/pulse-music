import { Schema } from "mongoose";

const ForgotPasswordSchema = new Schema({
    tokenHash: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    }
})