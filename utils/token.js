import jwt  from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import { userSchemaToken } from '../validation/token.validation.js';


const JWT_SECRET = process.env.JWT_SECRET ;

export  async function createUserToken(user) {
    const validationResult = await  userSchemaToken.safeParse({
        userId: user.id,
        email: user.email,
    });
    if (!validationResult.success) {
        throw new Error('Invalid user data for token creation');
    }

    const payloadValidatedData = {
        userId: validationResult.data.userId,
        email: validationResult.data.email,
    };
    const token = jwt.sign(payloadValidatedData , JWT_SECRET, { expiresIn: '1h' });
    return token;
}

export function validateUserToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const validationResult = userSchemaToken.safeParse(decoded);
        if (!validationResult.success) {
            throw new Error('Invalid token payload');
        }
        return validationResult.data;
    } catch (err) {
        throw new Error('Token validation failed: ' + err.message);
    }
}