import NextAuth, { NextAuthOptions } from "next-auth";
import Githubrovider from "next-auth/providers/github";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!;

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Githubrovider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // After OAuth success → go to custom session setup route
      if (url === baseUrl) {
        return `${baseUrl}/api/auth/create-session`;
      }
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
  },
  secret: JWT_PRIVATE_KEY,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
