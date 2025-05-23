import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class StrategiesService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });
  }

  async uploadImageBuffer(buffer: Buffer, filename: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'pulse_profile_pictures',
          public_id: filename,
          resource_type: 'image',
          overwrite: true,
          transformation: {
            width: 1000,
            height: 1000,
            crop: 'cover'
          }
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload failed without an error.'));
          }
          return resolve(result);
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }
}