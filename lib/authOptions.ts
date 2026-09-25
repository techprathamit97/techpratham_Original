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
                // One-time proof that the OTP was verified. Required only for
                // admin/accountant accounts (issued by /api/auth/login-otp/verify).
                otpProof: { label: "OTP Proof", type: "text" },
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

                    // ---- 2FA enforcement for staff (admin / accountant) ----
                    // These roles MUST present a valid one-time OTP proof. This
                    // check lives inside authorize() so it cannot be bypassed by
                    // signing in from the normal /auth/login page — every
                    // credentials sign-in for staff goes through here.
                    const role = user?.role?.type ?? "user";
                    if (role === "admin" || role === "accountant") {
                        const proof = credentials.otpProof;
                        if (
                            !proof ||
                            !user.loginOtpProofHash ||
                            !user.loginOtpProofExpiry ||
                            new Date(user.loginOtpProofExpiry).getTime() < Date.now()
                        ) {
                            throw new Error("OTP verification required");
                        }

                        const proofOk = await bcrypt.compare(proof, user.loginOtpProofHash);
                        if (!proofOk) {
                            throw new Error("OTP verification required");
                        }

                        // Consume the proof so it is single-use (atomic $unset).
                        await User.updateOne(
                            { _id: user._id },
                            { $unset: { loginOtpProofHash: "", loginOtpProofExpiry: "" } }
                        );
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
    // Session expires 15 hours after sign-in for ALL users (admin, accountant,
    // user). Uses the JWT strategy so the expiry is enforced on the token.
    session: {
        strategy: "jwt",
        maxAge: 15 * 60 * 60, // 15 hours (in seconds)
    },
    jwt: {
        maxAge: 15 * 60 * 60, // keep the JWT lifetime in sync with the session
    },
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
