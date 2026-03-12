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
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "credentials") return true;
            if (account?.provider === "google") {
                await connectMongo();
                const existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    const newUser = new User({ email: user.email, fullName: user.name });
                    await newUser.save();
                }
                return true;
            }
            return false;
        },
    },
};
