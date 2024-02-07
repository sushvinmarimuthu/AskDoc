import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from "next-auth/providers/github";
import AzureADProvider from 'next-auth/providers/azure-ad';
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import {MongoClient} from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {});

export const authOptions = {
    adapter: MongoDBAdapter(await client.connect()),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        AzureADProvider({
            clientId: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_SECRET_ID,
            tenantId: process.env.MICROSOFT_TENANT_ID,
        }),

        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                await connectDB();

                // check to see if email and password is there
                if (!credentials.email || !credentials.password) {
                    throw new Error('Please enter an email and password')
                }

                const user = await User.findOne({
                    email: credentials.email
                })

                // if no user was found
                if (!user || !user?.hashedPassword) {
                    throw new Error('No user found')
                }

                // check to see if password matches
                const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)

                // if password does not match
                if (!passwordMatch) {
                    throw new Error('Incorrect password')
                }

                return user;
            },
        }),
    ],
    secret: process.env.SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/login',
        error: '/auth/error',
    },
    callbacks: {
        async signIn({user, account, profile}) {
            return true;
        },
        session: async ({session, token}) => {
            if (token) {
                session.user.id = token._id;
                session.user.jwt = token.jwt;
                session.user.email = token.email;
                session.user.emailVerified = token.emailVerified;
                session.user.name = token.name;
                session.user.role = token.role;
            }

            return Promise.resolve(session);
        },
        jwt: async ({token, user, profile}) => {
            if (user) {
                token._id = user._id || user.id;
                token.jwt = user.jwt;
                token.email = user.email;
                token.emailVerified = user?.emailVerified || profile?.email_verified || null;
                token.name = user.name;
                token.role = user?.role || null;
            }
            return Promise.resolve(token);
        },
    },

    debug: process.env.NODE_ENV === "development",

}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}