import { LoginForm } from "@/components";
import { titleFont } from "@/config/fonts";
import React, { FC } from "react";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

const LoginPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className={`${titleFont.className} text-4xl mb-5`}>Ingresar</h1>

      <LoginForm pathnameDestination={searchParams.callbackUrl}/>
    </div>
  );
};

export default LoginPage;
