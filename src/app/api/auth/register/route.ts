import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import { connectToDB } from "@/libs/connectToDb";
import User from "@/models/User";
import {
  createADiscourseUser,
  getDiscourseUserByEmail,
} from "@/actions/discourseApi";

type body = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export async function POST(request: Request) {
  try {
    const body: body = await request.json();

    const { name, username, email, password } = body;

    if (!name || !username || !email || !password) {
      throw new Error("Missing fields!");
    }

    if (password.length < 10) {
      throw new Error("Password is less than 10 characters!");
    }

    await connectToDB();

    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      throw new Error("Email already exists!");
    }

    const userNameExists = await User.findOne({ username: name });

    if (userNameExists) {
      throw new Error("Username already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const discourseData = await getDiscourseUserByEmail(email);

    let user;

    if (discourseData.length) {
      user = await User.create({
        email: email,
        password: hashedPassword,
        discourseId: discourseData[0].id,
        avatar:
          process.env.DISCOURSE_API_URL +
          discourseData[0].avatar_template.replace("{size}", "96"),
        name: name,
        username: discourseData[0].username,
      });
    } else {
      const discourseId = await createADiscourseUser(
        name,
        email,
        password,
        username,
        "NDIS Provider"
      );
      if (discourseId.success) {
        user = await User.create({
          name: name,
          email: email,
          password: hashedPassword,
          username: username,
          discourseId: discourseId.user_id,
        });
      } else {
        return NextResponse.json(discourseId.message, {
          status: 400,
        });
      }
    }

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (err: any) {
    return NextResponse.json(err.message, { status: 400 });
  }
}
