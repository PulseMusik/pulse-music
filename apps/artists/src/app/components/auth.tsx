'use client'

import React, { useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { z } from 'zod';
import { useUser } from '../UserContext';
import { ACCOUNTS_URL, DEFAULT_PROFILE_PICTURE } from '@pulse/lib/constants';

const VALID_GENRES = [
  'Pop', 'Rock', 'Hip Hop', 'Jazz', 'Electronic', 'R&B', 'Classical',
  'Reggae', 'Country', 'Metal', 'Folk', 'Blues', 'Soul', 'Indie',
  'House', 'Techno', 'Trap', 'Drum & Bass', 'Ambient', 'Punk'
];

const claimFormSchema = z.object({
  stageName: z.string().min(2, "Stage name must be at least 2 characters"),
  bio: z.string().max(500, "Bio can't exceed 500 characters").optional(),
  genres: z.array(z.enum(VALID_GENRES as any)).nonempty("Please add at least one genre"),
});

const ClaimForm = () => {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [stageName, setStageName] = useState('');
  const [bio, setBio] = useState('');

  const { userData } = useUser()

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
    setError(null);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = tagInput.trim();

      const matchedGenre = VALID_GENRES.find(
        genre => genre.toLowerCase() === trimmed.toLowerCase()
      );

      if (!matchedGenre) {
        setError(`"${trimmed}" is not a valid genre`);
        return;
      }

      if (!tags.includes(matchedGenre)) {
        setTags(prev => [...prev, matchedGenre]);
      }

      setTagInput('');
    }
  };

  // Validate on submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const result = claimFormSchema.safeParse({
      stageName,
      bio,
      genres: tags,
    });

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0];
      setFormError(firstError ? firstError[0] : "Invalid form data");
      return;
    }
    
    try {
        console.log(result)
    } catch (e) {setError("Something went wrong. That's all we know")}
  };

  return (
    <div className='h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-100 px-4'>

      <a href={ACCOUNTS_URL!}>
        <img className='absolute w-7.5 top-5 right-7.5 rounded-full cursor-pointer' src={userData?.pictures?.current?.url || DEFAULT_PROFILE_PICTURE} />
      </a>

      <div className="h-full w-full flex items-center justify-center">
        <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-semibold p-2 text-center">Create your artist profile</h1>

            <div className="space-y-2">
            <label htmlFor="stageName" className="block text-sm font-medium text-gray-700">
                Stage name
            </label>
            <input
                id="stageName"
                name="stageName"
                placeholder="e.g. DJ Shadows"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                value={stageName}
                onChange={e => setStageName(e.target.value)}
            />
            </div>

            <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
            </label>
            <textarea
                id="bio"
                name="bio"
                placeholder="If a bio is not provided, we may search for a bio from external music metadata providers"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                rows={4}
                style={{ resize: 'none' }}
                value={bio}
                onChange={e => setBio(e.target.value)}
            />
            </div>

            <div className="space-y-3">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Genres
            </label>
            <input
                id="tags"
                name="tags"
                placeholder="e.g. Pop, Rock"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                value={tagInput}
                onChange={handleTagInput}
                onKeyDown={handleTagKeyDown}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                <div
                    key={index}
                    className="inline-block bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-gray-300 transition"
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                >
                    <p className='top-1'>{tag}</p>
                </div>
                ))}
            </div>
            </div>

            {formError && (
            <p className="text-center text-red-600 font-semibold">{formError}</p>
            )}

            <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg py-3 transition cursor-pointer"
            >
            Submit
            </button>
        </form>
        </div>
    </div>
  );
};

export default ClaimForm;