import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_Id ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
};

export default NextAuth(authOptions);

// export { handler as GET, handler as POST };
