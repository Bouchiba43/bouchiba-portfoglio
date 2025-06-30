// This is a utility script to create your first admin user
// Run this once to set up your admin account

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'

export async function createAdminUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log('Admin user created successfully:', userCredential.user.email)
    return userCredential.user
  } catch (error) {
    console.error('Error creating admin user:', (error as Error).message)
    throw error
  }
}

//  Usage example (uncomment and modify as needed):
 createAdminUser('test@gmail.com', 'password!')
   .then(() => console.log('Setup complete!'))
   .catch(console.error)