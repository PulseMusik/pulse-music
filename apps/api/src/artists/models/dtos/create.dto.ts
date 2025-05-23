import {
    IsString,
    IsArray,
    ArrayNotEmpty,
    MaxLength,
    IsOptional,
  } from 'class-validator';
  import { Transform } from 'class-transformer';
  import { escape } from 'lodash';
  
  function cleanInput(value: string): string {
    return escape(
      value
        .trim()
        .normalize('NFKC')
        .replace(/[\u200B-\u200D\uFEFF]/g, '') 
    );
  }
  
  export class CreateArtistDto {
    @IsString()
    @MaxLength(50)
    @Transform(({ value }) => cleanInput(value))
    stageName: string;
  
    @IsArray()
    @ArrayNotEmpty()
    @Transform(({ value }) =>
      value.map((genre: string) => cleanInput(genre))
    )
    genres: string[];
  
    @IsOptional()
    @IsString()
    @MaxLength(500)
    @Transform(({ value }) => cleanInput(value))
    bio?: string;
  }  