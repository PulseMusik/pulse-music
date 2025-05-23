import * as jwt from 'jsonwebtoken'
import User from 'src/models/User';
import { EncryptionService } from './encryption.service';

export async function getUser(req: any) {
    const token = req.cookies?.['PULSE_ACCESS'];
    if (!token) {
        return { status: 'unauthorized', message: 'User not authenticated' };
    }

    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_TOKEN);
    } catch {
        return { status: 'unauthorized', message: 'Session expired or invalid' };
    }

    const userId = decoded?.userId;
    if (!userId) {
        return { status: 'unauthorized', message: 'Invalid user token' };
    }

    const userData = await User.findOne({ pulseId: userId });
    if (!userData) {
        return { status: 'not_found', message: 'User not found' };
    }

    if (userData.userDeleted) {
        return { status: 'bad_request', message: 'Account already deleted' };
    }

    const publicFacingData = {
        pulseId: userData.pulseId,
        dob: userData.dob,
        pictures: userData.pictures,
        preferences: userData.preferences,
        emailVerified: userData.emailVerified,
        language: userData.language,
        friends: userData.friends,
        gender: userData.gender,
        firstName: userData.firstName
    }

    return {
        data: publicFacingData
    }
}