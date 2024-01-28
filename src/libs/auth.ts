import User from "@/models/User";
import { connectToDB } from "./connectToDb";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, getServerSession } from "next-auth";
import { validateAndReturnPayload } from "@/actions/userActions";

export const authOptions: AuthOptions = {
  pages: {
    newUser: "/directory",
    signIn: "/sign-in",
    signOut: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        sso: {
          type: "text",
        },
        sig: {
          type: "text",
        },
      },

      async authorize(credentials) {
        if (!credentials?.sso && !credentials?.sig) {
          throw new Error("Invalid Request! Try Again");
        }

        const payload = await validateAndReturnPayload(
          credentials.sso,
          credentials.sig
        );

        if (!payload) {
          throw new Error("Invalid Request! Try Again");
        }

        if (!payload.groups?.includes("NDIS_Provider")) {
          throw new Error("Only NDIS Providers Allowed");
        }

        await connectToDB();

        //! check if user already exists
        let user = await User.findOne({ email: payload?.email });
        if (user) {
          return user;
        }

        //! if not, create a new document and save user in MongoDB

        user = await User.create({
          email: payload?.email,
          discourseId: payload?.id,
          avatar: payload?.avatar,
          name: payload?.name,
          username: payload?.username,
        });

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      //! store the user id from MongoDB to session
      await connectToDB();
      const sessionUser: UserType | null = await User.findOne({
        email: session.user?.email,
      }).lean();
      if (sessionUser) {
        session.user.id = sessionUser._id;
        session.user.discourse_id = sessionUser.discourseId;
        session.user.name = sessionUser.username;
        session.user.image = sessionUser.avatar;
        session.user.fullName = sessionUser.name;
      }
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
};

export const getAuthSession = async () => {
  return await getServerSession(authOptions);
};
