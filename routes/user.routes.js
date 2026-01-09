import express from 'express';
import {hashPassswordWithSalt} from  '../utils/hash.js'
import { getUserByEmail, createUser } from '../services/user.service.js';
import { signupPostRequestBodySchema } from '../validation/request.validation.js';
import { loginPostRequestBodySchema } from '../validation/request.validation.js';
import {createUserToken} from '../utils/token.js';


const router = express.Router();

router.post('/signup', async(req, res) => {
   const validationResult =  await signupPostRequestBodySchema.safeParseAsync(req.body);
   if(!validationResult.success){
     return res.status(400).json({ error: 'Invalid request data', details: validationResult.error.errors });
   }

   const { firstname, lastname, email, password } = validationResult.data;
    // Check if user with the same email already exists

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
  

   /// validate input   done by the zod schema in future

 
   // Hash password
   const { salt, password: hashedPassword } = hashPassswordWithSalt(password);

   // Create new user in database
   const newUser = await createUser({
     firstname,
     lastname,
     email,
     salt,
     password: hashedPassword,
   });
   
   res.status(201).json({ user: newUser });





});

router.post('/login', async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: 'Invalid request data', details: validationResult.error.errors });
  }
  const { email, password } = validationResult.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  // Verify password
  const { salt, password: hashedPassword } = hashPassswordWithSalt(password, existingUser.salt);
  if (hashedPassword !== existingUser.password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  // Generate JWT token
  const token = await createUserToken(existingUser);
  res.status(200).json({ token });


});




export default router;

