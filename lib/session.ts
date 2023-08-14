import { getServerSession } from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import type { User as AdapterUser, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

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
      return session;
    },
    async signIn({user} : {user: AdapterUser | User }) {
      try {
        // const session = await getServerSession();
        // const token = jsonwebtoken.sign(
        //   { id: user.id, email: user.email, name: user.name },
        //   process.env.JWT_SECRET!
        // );
        // await session.create({ jwt: token });
        return true;
      } catch (error:any) {
        console.log(error);
        return false;
      };
    },
  }
}
    

