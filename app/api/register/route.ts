import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/user';
import bcrypt from 'bcryptjs';
import { connectMongo } from '@/utils/mongodb';

export const POST = async (request: any) => {
  const { email, password, name, phone } = await request.json();

  await connectMongo();
  console.log("connected with db");

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new User({
    email,
    name,
    phone,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return new NextResponse("user is registered", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};
