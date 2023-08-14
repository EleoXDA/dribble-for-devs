import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import type { User as AdapterUser, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { Session } from "inspector";
import { SessionInterface, UserProfile } from "@/common.types";
import { createUser, getUser } from "./actions";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // jwt: {
  //   encode: (secret, token) => {
  //     return Promise.resolve("");
  //   },
  //   decode: (secret, token) => {
  //     return Promise.resolve({} as JWT);
  //   },
  // },
  theme: {
    colorScheme: "light",
    logo: "/logo.png",
  },
  callbacks: {
    async session({session}) {
      const email = session?.user?.email as string;
      try {
        const data = await getUser(email) as { user?: UserProfile };
        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data.user,
          }
        }
        return newSession;
      } catch (error) {
        console.log(error);
        return session
      }
    },
    async signIn({user} : {user: AdapterUser | User }) {
      try {
        const userExists = await getUser(user?.email as string) as { user?: UserProfile };
        if (!userExists.user) {
          await createUser(user.name as string, user.email as string, user.image as string);
        }
        return true;
      } catch (error:any) {
        console.log(error);
        return false;
      };
    },
  }
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions) as SessionInterface;
  return session;
}
    

