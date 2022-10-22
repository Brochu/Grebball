import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"

const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    NEXTAUTH_URL: 'http://localhost:3000/api/auth/signin',
}

export default (req, res) => NextAuth(req, res, options)
