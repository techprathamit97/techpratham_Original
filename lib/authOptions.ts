import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "@/models/user";
import { connectMongo } from '@/utils/mongodb';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                await connectMongo();
                try {
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("Email Not Found");
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordCorrect) {
                        throw new Error("Invalid Password");
                    }

                    return user;
                } catch (err: any) {
                    throw new Error(err);
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
    ],
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "credentials") return true;
            if (account?.provider === "google") {
                await connectMongo();
                try {
                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        // Create new user with Google account
                        const newUser = new User({
                            name: user.name,
                            email: user.email,
                            phone: '', // Google doesn't provide phone
                            password: '', // No password for OAuth users
                            role: {
                                type: 'user',
                                position: '',
                            },
                            profile: user.image || "",
                            courses: {
                                enrolled: [],
                                completed: []
                            }
                        });
                        await newUser.save();
                    }
                    return true;
                } catch (error) {
                    console.error('Error creating Google user:', error);
                    return false;
                }
            }
            return false;
        },
        async redirect({ url, baseUrl }) {
            // Handle redirect after successful login
            // If url is a relative path, make it absolute
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // If url is on the same origin, allow it
            else if (new URL(url).origin === baseUrl) return url;
            // Otherwise redirect to base URL
            return baseUrl;
        },
    },
};
