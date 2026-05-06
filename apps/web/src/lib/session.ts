import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export type SessionIdentity = {
  email: string;
  name: string | null;
  image: string | null;
};

const developmentIdentity: SessionIdentity = {
  email: "thomas@smartfellas.local",
  name: "Thomas",
  image: null,
};

export async function getSessionIdentity(): Promise<SessionIdentity | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (email) {
    return {
      email,
      name: session.user?.name ?? null,
      image: session.user?.image ?? null,
    };
  }

  if (process.env.NODE_ENV === "development") {
    return developmentIdentity;
  }

  return null;
}

export function getAuthOptions(identity: SessionIdentity | null) {
  if (!identity) {
    return {};
  }

  return {
    token: identity.email,
    userName: identity.name,
    userImage: identity.image,
  };
}
