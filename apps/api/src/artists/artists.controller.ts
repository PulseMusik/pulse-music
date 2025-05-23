import { Controller, Post, HttpStatus, Body, Req, Res } from '@nestjs/common';
import * as uuid from 'uuid';
import { Request, Response } from 'express';
import { CreateArtistDto } from './models/dtos/create.dto';

import Artist from './models/db/CreateArtist';
import { decodeTokenFromRequest } from 'src/common/utils';

@Controller('artists')
export class ArtistsController {
  @Post('create_artist')
  async signup(@Body() artist: CreateArtistDto, @Req() req: Request, @Res() res: Response) {
    if (!artist.stageName) {
      return res.status(HttpStatus.BAD_REQUEST).send({ status: 'bad_request', message: 'Please provide a stage name.' });
    }

    if (!artist.genres || artist.genres.length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).send({ status: 'bad_request', message: 'Please provide at least one genre.' });
    }

    try {
      const authUserData = await decodeTokenFromRequest(req);

      if (!authUserData || !authUserData.data?.pulseId) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ status: 'unauthorized', message: 'User not authenticated' });
      }

      if (authUserData.data.pulseId === null) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ status: 'unauthorized', message: 'User not authenticated' });
      }

      const existingArtist = await Artist.findOne({ pulseId: authUserData.data.pulseId });
      if (existingArtist) {
        return res.status(HttpStatus.CONFLICT).send({
          status: 'conflict',
          message: 'This user already has an artist profile.',
        });
      }

      const artistId = uuid.v4();

      const newArtist = new Artist({
        artistId: artistId,
        pulseId: authUserData.data.pulseId,
        profile: {
          stageName: artist.stageName,
          bio: artist.bio || '',
          genres: artist.genres,
        },
        pictures: {
          current: {
            url: 'https://www.rollingstone.com/wp-content/uploads/2025/01/ed-sheeran-foundation-launch.jpg',
            uploadedAt: new Date(),
          },
        },
        verified: false,
        stats: {
          followers: 0,
          totalStreams: 0,
        },
      });

      await newArtist.save();

      return res.status(HttpStatus.CREATED).send({
        status: 'success',
        message: { artistId },
      });
    } catch (e: any) {
      console.error(e)
      if (e && e.code === 11000 && e.keyValue) {
        const field = Object.keys(e.keyValue)[0];
        const value = e.keyValue[field];

        if (field === 'stageName') {
          return res.status(HttpStatus.CONFLICT).send({
            status: 'conflict',
            message: `An artist with this stage name (${value}) already exists.`,
          });
        }

        if (field === 'pulseId') {
          return res.status(HttpStatus.CONFLICT).send({
            status: 'conflict',
            message: 'This user already created an artist. Please use a different account.',
          });
        }

        return res.status(HttpStatus.CONFLICT).send({
          status: 'conflict',
          message: `Duplicate value for ${field}: ${value}`,
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        status: 'error',
        message: 'Something went wrong.',
      });
    }
  }
}