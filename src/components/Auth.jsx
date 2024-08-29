import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import './Auth.css'
import { auth } from '../firebase'

const Auth = () => {
    const auth = getAuth()
    const [user, setUser] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // is logged
    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            setUser(userCredential.user)

        } catch (error) {
            console.error('Error registering: ', error)
        }
    }

    const handleSignIn = async (e) => {
        e.preventDefault()
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            setUser(userCredential.user)
        } catch (error) {
            console.error('Error signing in: ', error)
        }
    } 

    const handleSignOut = async () => {
        try {
            await signOut(auth)
            // if !user in JSX
            setUser(null)
        } catch (error) {
            console.error('Error logging out: ', error)
        }
    }

    return (
        <div className='auth-container'>

            {!user ? (
                <section className='auth-align'>
                    <h2>Sign Up / Sign In</h2>
                    <form onSubmit={handleSignIn}>
                        <input type="email" 
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                        <input type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type='submit'>Sign In</button>
                    </form>
                    <button onClick={handleSignUp}>Sign Up</button>
                </section>
            ) : (
                <section>
                    <h2>Welcome, {user.email}</h2>
                    <button onClick={handleSignOut}>Sign Out</button>
                </section>
            )}
            
            {!user ? (
                <section>
                    <h2>Sign Up / Sign In</h2>
                </section>
            ) : (
                <section>

                </section>
            )}

        </div>
    )
}

export default Auth
