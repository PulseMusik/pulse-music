import mongoose, { Schema, Document } from "mongoose";

export interface PictureEntry {
    url: string;
    uploadedAt?: Date;
}

export interface FriendPreferences {
    showActivity: boolean;
    showProfilePicture: boolean;
    nickname?: string;
}

export interface Friend {
    id: string;
    addedAt?: Date;
    preferences: FriendPreferences;
}

interface PulseAccountDocument extends Document {
    pulseId: string;
    childAccount: {
        isChild: boolean;
        parents?: {
            motherId?: string;
            fatherId?: string;
            otherAccounts?: string[];
        };
        permissions?: {
            signInWithoutParent?: boolean;
            explicitContent?: boolean;
            postPublicContent?: boolean;
            createPrivateContent?: boolean;
        };
    };
    firstName: string;
    middleName?: string;
    lastName?: string;
    gender?: string;
    password?: string,
    dob: {
        day: number;
        month: string;
        year: number;
    };
    email: string;
    emailVerified: boolean;
    emailVerifiedAt?: Date | null;
    pictures: {
        current: PictureEntry;
        history: PictureEntry[];
    };
    phoneNumber?: string;
    verifiedPhoneNumber: boolean;
    phoneVerifiedAt?: Date;
    language: string;
    recovery?: {
        recoveryCodes?: string[];
        recoveryPhone?: boolean;
        recoveryEmail?: boolean;
    };
    preferences: {
        darkMode: boolean;
    };
    loginMetadata: {
        lastLogin?: Date;
        loginCount: number;
        lastLoginIP?: string;
        lastLoginDevice?: string;
        lastLoginBrowser?: string;
        geoLocation?: { country: string; city: string };
    };
    role: 'user' | 'admin' | 'moderator';
    userDeleted: boolean;
    friends: Friend[];
    lastUpdatedBy?: string;
    metadata: {
        ip: string; ss
        country: string;
        city: string;
        device: string;
        platform: string;
        appVersion: string;
        languagePreference: string;
        marketingOptIn: boolean;
    };
    appUsageStats: {
        lastActivityAt?: Date;
        totalSessionTime: number;
        totalSessions: number;
        featureUsage: {
            [key: string]: number;
        };
    };
}

const PulseAccountSchema: Schema = new Schema<PulseAccountDocument>({
    pulseId: {
        type: String,
        required: true,
        unique: true
    },
    childAccount: {
        isChild: {
            type: Boolean,
            default: false
        },
        parents: {
            motherId: { type: String },
            fatherId: { type: String },
            otherAccounts: [{ type: String }]
        },
        permissions: {
            signInWithoutParent: { type: Boolean, default: false },
            explicitContent: { type: Boolean, default: false },
            postPublicContent: { type: Boolean, default: false },
            createPrivateContent: { type: Boolean, default: true }
        }
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String
    },
    gender: {
        type: String
    },
    dob: {
        day: { type: Number, required: true },
        month: { type: String, required: true },
        year: { type: Number, required: true }
    },
    email: {
        type: String,
        required: true,
    },
    emailVerified: {
        type: Boolean,
        default: true
    },
    emailVerifiedAt: {
        type: Date
    },
    pictures: {
        current: {
            url: { type: String, required: true },
            uploadedAt: { type: Date }
        },
        history: [{
            url: { type: String },
            uploadedAt: { type: Date }
        }]
    },
    phoneNumber: {
        type: String,
        required: false,
        default: ''
    },
    verifiedPhoneNumber: {
        type: Boolean,
        default: false
    },
    phoneVerifiedAt: {
        type: Date
    },
    language: {
        type: String,
        default: 'en'
    },
    recovery: {
        recoveryCodes: [{ type: String }],
        recoveryPhone: {
            type: Boolean,
            default: false
        },
        recoveryEmail: {
            type: Boolean,
            default: false
        }
    },
    preferences: {
        darkMode: {
            type: Boolean,
            default: true
        }
    },
    loginMetadata: {
        lastLogin: { type: Date },
        loginCount: { type: Number, default: 0 },
        lastLoginIP: { type: String },
        lastLoginDevice: { type: String },
        lastLoginBrowser: { type: String },
        geoLocation: {
            country: { type: String },
            city: { type: String }
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    userDeleted: {
        type: Boolean,
        default: false
    },
    friends: [{
        id: { type: String },
        addedAt: { type: Date },
        preferences: {
            showActivity: { type: Boolean, default: true },
            showProfilePicture: { type: Boolean, default: true },
            nickname: { type: String }
        }
    }],
    metadata: {
        ip: { type: String },
        country: { type: String },
        city: { type: String },
        device: { type: String },
        platform: { type: String },
        appVersion: { type: String },
        languagePreference: { type: String },
        marketingOptIn: { type: Boolean, default: false }
    },
    appUsageStats: {
        lastActivityAt: { type: Date },
        totalSessionTime: { type: Number, default: 0 },
        totalSessions: { type: Number, default: 0 },
        featureUsage: {
            type: Map,
            of: Number,
            default: {}
        }
    }
}, { timestamps: true });

PulseAccountSchema.index({ email: 1 })
PulseAccountSchema.index({ firstName: 1, lastName: 1 })
PulseAccountSchema.index({ phoneNumber: 1 })

export default mongoose.model<PulseAccountDocument>("accounts", PulseAccountSchema);

export const DefaultPulseAccount: Partial<PulseAccountDocument> = {
    childAccount: {
        isChild: false
    },
    emailVerified: false,
    emailVerifiedAt: null
}