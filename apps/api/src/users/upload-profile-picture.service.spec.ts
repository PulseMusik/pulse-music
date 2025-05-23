import { Test, TestingModule } from '@nestjs/testing';
import { UploadProfilePictureService } from './upload-profile-picture.service';

describe('UploadProfilePictureService', () => {
  let service: UploadProfilePictureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadProfilePictureService],
    }).compile();

    service = module.get<UploadProfilePictureService>(UploadProfilePictureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
