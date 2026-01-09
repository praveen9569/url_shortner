import { url } from 'inspector';
import { z} from 'zod';


export const signupPostRequestBodySchema = z.object({
    firstname: z.string().min(1, 'First name is required'),
    lastname: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});


export const loginPostRequestBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const shortenPostRequestBodySchema = z.object({
    url: z.string().url(),
    code: z.string().optional(),
});