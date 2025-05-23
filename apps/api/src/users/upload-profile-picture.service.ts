import { Injectable, PipeTransform, UnprocessableEntityException, Logger, ArgumentMetadata, InternalServerErrorException } from '@nestjs/common';
import { extname } from 'path';
import * as uuid from 'uuid';
import { fileTypeFromBuffer } from 'file-type';

@Injectable()
export class FileValidationPipe implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>> {
  private readonly logger = new Logger(FileValidationPipe.name);
  private readonly allowedExtensions = ['.png', '.jpg', '.jpeg'];
  private readonly mimeTypes = ['image/jpeg', 'image/png'];
  private readonly maxFileSize = 5 * 1024 * 1024;

  private readonly magicNumbers = {
    '.jpg': ['ffd8ff'],
    '.jpeg': ['ffd8ff'],
    '.png': ['89504e47'],
  };

  async transform(file: Express.Multer.File, metadata?: ArgumentMetadata): Promise<Express.Multer.File> {
    if (!file) {
      throw new UnprocessableEntityException('No file provided');
    }

    if (!file.buffer) {
      this.logger.warn('No file buffer available for validation');
      throw new InternalServerErrorException('File buffer missing');
    }

    if (file.size > this.maxFileSize) {
      throw new UnprocessableEntityException('File size is too large');
    }

    const extension = extname(file.originalname).toLowerCase();

    if (!this.allowedExtensions.includes(extension)) {
      throw new UnprocessableEntityException(`File type ${extension} not supported`);
    }

    // --- Custom magic number check ---
    const fileMagic = file.buffer.slice(0, 4).toString('hex').toLowerCase();
    const allowedMagicNumbers = this.magicNumbers[extension];

    if (!allowedMagicNumbers) {
      throw new UnprocessableEntityException(`File type ${extension} not supported`);
    }

    const matchesMagic = allowedMagicNumbers.some(magic => fileMagic.startsWith(magic));

    if (!matchesMagic) {
      this.logger.warn(`File content didn't match file extension: expected ${allowedMagicNumbers}, got ${fileMagic}`);
      throw new UnprocessableEntityException("File content doesn't match file extension");
    }

    const detectedFileType = await fileTypeFromBuffer(file.buffer);

    if (!detectedFileType) {
      this.logger.warn('file-type could not detect file type');
      throw new UnprocessableEntityException('Cannot determine file type');
    }

    if (!this.mimeTypes.includes(detectedFileType.mime)) {
      this.logger.warn(`Detected MIME type ${detectedFileType.mime} not supported`);
      throw new UnprocessableEntityException(`File MIME type ${detectedFileType.mime} not supported`);
    }

    if (detectedFileType.ext !== extension.replace('.', '')) {
      this.logger.warn(`File extension (${extension}) and file-type extension (${detectedFileType.ext}) mismatch`);
      throw new UnprocessableEntityException('File extension does not match file content');
    }

    // Passed all validations - assign new filename
    const newFileName = uuid.v4() + extension;
    file.filename = newFileName;

    return file;
  }
}