import React, { ComponentType } from "react";
import { cookies } from "next/headers";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

type UserRoles = string[];

interface Props {
  roles: UserRoles;
}

interface CustomJwtPayload extends JwtPayload {
  role: string;
}

const Checkrole = <P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredRole: UserRoles
): React.FC<P> => {
  const WithAuthorization: React.FC<P> = (props) => {
    const cookieStore = cookies();
    const token = cookieStore.get("auth")?.value;
    const data: CustomJwtPayload = jwtDecode(token ? token : "");
    const loggedInUserRole = data.role;

    if (!requiredRole.includes(loggedInUserRole)) {
      // Redirect or render an unauthorized page
      redirect('/app');
      return null; // You might choose to return a loading state or null
    }

    return <WrappedComponent {...props as P} />;
  };

  return WithAuthorization;
};

export default Checkrole;
