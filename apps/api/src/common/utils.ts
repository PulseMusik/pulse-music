import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import User from '../../src/models/User';

export async function decodeTokenFromRequest(request: any) {
  const token = request.cookies?.['PULSE_ACCESS'];

  if (!token) {
    throw new Error('You are not logged in. Please log in to continue.');
  }

  let decodedData;
  try {
    decodedData = jwt.verify(token, process.env.JWT_TOKEN || '');
  } catch (e) {
    throw new Error('We could not verify your session. Please try again.');
  }

  if (!decodedData) {
    throw new Error('We could not verify your session. Please try again.');
  }

  let userData;
  try {
    userData = await User.findOne({ pulseId: decodedData.userId });
  } catch (e) {
    throw new Error('We could not retrieve your account information. Please try again.');
  }

  if (!userData) {
    throw new Error('We could not find your account. Please log in again.');
  }

  if (userData.userDeleted === true) {
    throw new Error('Your account has been deleted.');
  }

  // Decrypt email manually
  let decryptedEmail = '';
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'secret', 'salt', 32);
    const iv = Buffer.alloc(16, 0);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(userData.email, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    decryptedEmail = decrypted;
  } catch (e) {
    console.error('Cannot decode email');
  }

  return {
    data: {
      pulseId: userData.pulseId,
      dob: userData.dob,
      pictures: userData.pictures,
      preferences: userData.preferences,
      username: userData.username,
      email: decryptedEmail || '',
      emailVerified: userData.emailVerified,
      language: userData.language,
      friends: userData.friends,
      gender: userData.gender,
      firstName: userData.firstName
    }
  };
}