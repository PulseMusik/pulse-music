import mongoose, { Schema, Document } from "mongoose"

interface PulseSession extends Document {
    userId: string,
    sessionId: string,
    refreshTokenHash: string,
    createdAt: Date,
    expiresAt: Date,
    ip: string,
    userAgent: string,
    isActive: boolean
}

const SessionSchema = new Schema<PulseSession>({
    sessionId: { type: String, required: true, unique: true },
    refreshTokenHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    ip: String,
    userAgent: String,
    isActive: { type: Boolean, default: true },
})

SessionSchema.index({ sessionId: 1 })
SessionSchema.index({ ip: 1 })

export default mongoose.model<PulseSession>("sessions", SessionSchema);