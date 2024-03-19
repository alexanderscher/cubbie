import NextAuth, { User, type NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";

import prisma from "@/prisma/client";
import { getUserByEmail } from "@/app/lib/userDb";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
          },
          select: {
            id: true,
            email: true,
            password: true,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (user.password) {
          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }
        }

        return {
          id: user.id + "",
          email: user.email.toLowerCase(),
        };
      },
    }),
  ],
  pages: {
    signIn: "/not-found",
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const newUser = await getUserByEmail(user.email as string);
        console.log(newUser);

        return { ...token, id: newUser?.id };
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },

    async signIn({ user, account }) {
      const url = "http://localhost:3000/api/signup";
      //   const isProduction = process.env.NODE_ENV === "production";
      //   const url = isProduction
      //     ? "https://deadendbooks.org/api/signup"
      //     : "http://localhost:3000/api/signup";

      if (account?.provider === "google") {
        const data = {
          email: user.email,
          password: "",
          provider: "Google",
        };

        try {
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data }),
          });

          if (response.ok) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
