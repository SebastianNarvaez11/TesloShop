import NextAuth from "next-auth";
import prisma from "./lib/prisma";
import authConfig from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // adapter: PrismaAdapter(prisma), solo es necesario cuando se implementa
  // la autenticacion por google o similares, para que next-auth guarde esos usuarios automaticamente en la BD
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-account",
  },
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token }) {
      //aqui puedo poner informacion en el token

      const user = await prisma.user.findUnique({
        where: { email: token.email || "" },
        select: {
          email: true,
          id: true,
          image: true,
          name: true,
          role: true,
        },
      });

      if (!user) throw Error("Usuario no existe");

      token.data = user;
      return token;
    },

    async session({ session, token } :any) {
      session.user.role = token.data.role
      return session;
    }
  },
  ...authConfig,
});
