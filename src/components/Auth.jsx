import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth'
import './Auth.css'
import { auth } from '../firebase'

const Auth = () => {
    const auth = getAuth()
    const [user, setUser] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    // firebase errors
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    // password reset toggle
    const [isPasswordReset, setIsPasswordReset] = useState(false)

    // is logged
    const handleSignUp = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            setUser(userCredential.user)

        } catch (err) {
            setError(err.message)
        }
    }

    const handleSignIn = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            setUser(userCredential.user)
        } catch (err) {
            setError(err.message)
        }
    } 

    const handlePasswordReset = async (e) => {
        e.preventDefault
        setError('')
        setMessage('')
        if (!email) {
            setError('Please enter your email to reset password')
            return
        } 
        try {
            await sendPasswordResetEmail(auth, email)
            setMessage('Password reset email sent! Check your inbox.')
            setIsPasswordReset(false)
        } catch (err) {
            setError(err.message)
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

    // toggle sign in/out
    const toggleAuthMode = () => {
        setIsSignUp(!isSignUp)
        setIsPasswordReset(false)
    }

    return (
        <div className='auth-container'>
        {!user ? (
            <section className='auth-align'>
                <h2>{isPasswordReset ? 'Reset Password' : isSignUp ? 'Register' : 'Sign In'}</h2>
                {!isPasswordReset ? (
                    <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                        <input 
                            type="email" 
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type='submit'>{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordReset}>
                        <input 
                            type="email" 
                            placeholder='Enter your email to reset password'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type='submit'>Reset Password</button>
                    </form>
                )}
                {error && <p className='error-message'>{error}</p>}
                {message && <p className='success-message'>{message}</p>}

                {!isPasswordReset && !isSignUp && (
                    <button onClick={() => setIsPasswordReset(true)}>
                        Forgot Password?
                    </button>
                )}

                {!isPasswordReset && (
                    <button onClick={toggleAuthMode}>
                        {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Register'}
                    </button>
                )}

                {isPasswordReset && (
                    <button onClick={() => setIsPasswordReset(false)}>
                        Back to {isSignUp ? 'Register' : 'Sign In'}
                    </button>
                )}
            </section>
        ) : (
            <section>
                <h2>Welcome, {user.email}</h2>
                <button onClick={handleSignOut}>Sign Out</button>
            </section>
        )}
    </div>
    )
}

export default Auth
