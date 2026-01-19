import {db} from '../db/index.js';
import {userstable} from '../models/user.model.js';
import { eq } from 'drizzle-orm';


export async function getUserByEmail(email) { 
    const [existingUser] = await db.select({
        id: userstable.id,
        firstname: userstable.firstname,
        lastname: userstable.lastname, 
        email: userstable.email,
        password: userstable.password,
        salt: userstable.salt,
        created_at: userstable.created_at,
        updated_at: userstable.updated_at,
    })
    .from(userstable)
    .where(eq(userstable.email, email));  
    
    return existingUser;
}

export async function createUser(userData) {
  const { firstname, lastname, email, salt, password } = userData;
  
  const [newUser] = await db
    .insert(userstable)
    .values({
      firstname,
      lastname,
      email,
      salt,
      password,
    })
    .returning();
    
  return newUser;
}