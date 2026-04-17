// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // DBからユーザーを探す
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        // パスワードの照合
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // ログイン成功時に返す情報
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // ★ここでロール（DOCTORかPATIENT）を持たせます
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    // JWTトークンにロールを含める
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // セッションにロールを含める（これでフロント側で「院長か？」が判定できる）
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  // （オプション）ログインページのURLを指定する場合
  // pages: {
  //   signIn: '/login',
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
