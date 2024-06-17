
import { User } from "@/src/common/interfaces/user.interface";

type AuthState = {
  accessToken: string;
  user: User;
};

export const authState: AuthState = {
  accessToken: "",
  user: {} as User,
};
