import mongoose, { Schema, Document } from 'mongoose';

interface PictureEntry {
  url: string;
  uploadedAt?: Date;
}

interface SocialLink {
  platform: 'youtube' | 'spotify' | 'soundcloud' | 'apple_music' | 'instagram';
  handle: string;
  url: string;
  verified: boolean;
}

interface ArtistDocument extends Document {
  pulseId?: string;
  artistId: string;
  profile: {
    stageName: string;
    bio?: string;
    genres: string[];
    country?: string;
  };
  pictures: {
    current: PictureEntry;
    history?: PictureEntry[];
  };
  socials: SocialLink[];
  verified: boolean;
  isDeleted: boolean;
  stats: {
    followers: number;
    totalStreams: number;
    popularityScore?: number;
    lastActiveAt?: Date;
  };
}

const ArtistSchema = new Schema<ArtistDocument>({
  pulseId: {
     type: String,
     required: false,
     unique: true
  },
  artistId: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    stageName: {
      type: String,
      required: true,
      index: true,
      trim: true,
      maxlength: 60
    },
    bio: {
      type: String,
      maxlength: 800,
      default: ''
    },
    genres: {
      type: [String],
      required: true,
      index: true
    },
    languages: {
      type: [String],
      default: ['en']
    },
    country: {
      type: String
    }
  },
  pictures: {
    current: {
      url: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now }
    },
    history: [{
      url: { type: String },
      uploadedAt: { type: Date }
    }]
  },
  socials: {
    type: [{
      platform: {
        type: String,
        enum: ['youtube', 'spotify', 'soundcloud', 'apple_music', 'instagram'],
        required: true
      },
      handle: { type: String, required: true },
      url: { type: String, required: true },
      verified: { type: Boolean, default: false }
    }],
    default: [],
    required: false
  },  
  verified: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true
  },
  stats: {
    followers: { type: Number, default: 0 },
    totalStreams: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 },
    lastActiveAt: { type: Date }
  }
}, { timestamps: true });

ArtistSchema.index({ 'profile.stageName': 1 });
ArtistSchema.index({ 'profile.genres': 1 });
ArtistSchema.index({ verified: 1, published: 1 });
ArtistSchema.index({ 'stats.popularityScore': -1 });

export default mongoose.model<ArtistDocument>('Artist', ArtistSchema);