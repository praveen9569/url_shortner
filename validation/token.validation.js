import {z} from 'zod';


export  const userSchemaToken = z.object({
    userId: z.string().uuid(),
    email: z.string().email(),
});