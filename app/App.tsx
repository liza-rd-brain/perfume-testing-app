import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import ReactDOM from "react-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Login } from "./widgets/Login";
import { TastingBoard } from "./pages/TastingBoard";

type Note = {
  id?: number;
  name: string;
  title?: string;
  [key: string]: any;
};

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const changeAuthorized = () => {
    setIsAuthorized(true);
  };

  console.log({ isAuthorized });
  //!TODO: localstore
  /* const isAuthorized */
  // return <QRCodeCanvas value="http://192.168.0.13:5173/" />;
  return !isAuthorized ? (
    <Login onLoginSuccess={changeAuthorized} />
  ) : (
    <TastingBoard />
  );
}
