import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import Apple from 'next-auth/providers/apple'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from './mongodb-adapter'
import connectToDatabase from './db'
import User from './models/user'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID,
      clientSecret: process.env.AUTH_APPLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
        
        // Fetch additional user data from our User model
        try {
          await connectToDatabase()
          const dbUser = await User.findOne({ email: user.email })
          if (dbUser) {
            session.user.points = dbUser.points
            session.user.level = dbUser.level
            session.user.streakDays = dbUser.streakDays
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        await connectToDatabase()
        
        // Check if user exists in our User collection
        let dbUser = await User.findOne({ email: user.email })
        
        if (!dbUser) {
          // Create new user with initial data
          dbUser = await User.create({
            name: user.name || profile?.name || 'Anonymous',
            email: user.email,
            image: user.image || profile?.image,
            points: 10, // Welcome bonus
            level: 1,
            streakDays: 0,
            lastActiveDate: new Date(),
            notifications: [{
              type: 'welcome',
              message: 'Welcome to Scripture Connect! Start your journey by asking a question or exploring the community.',
              read: false,
              createdAt: new Date(),
            }],
          })
        } else {
          // Update streak
          const now = new Date()
          const lastActive = dbUser.lastActiveDate
          
          if (lastActive) {
            const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
            
            if (diffDays === 1) {
              // Consecutive day login
              dbUser.streakDays += 1
              dbUser.points += Math.min(5 * dbUser.streakDays, 50) // Streak bonus, max 50
            } else if (diffDays > 1) {
              // Streak broken
              dbUser.streakDays = 1
            }
            // Same day login doesn't affect streak
          } else {
            dbUser.streakDays = 1
          }
          
          dbUser.lastActiveDate = now
          await dbUser.save()
        }
        
        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return true // Still allow sign in even if our custom logic fails
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'database',
  },
})

// Extend the session type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      points?: number
      level?: number
      streakDays?: number
    }
  }
}
