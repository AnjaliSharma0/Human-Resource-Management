import Image from "next/image";
import RegisterPage from "./auth/register/page";
import AuthProvider from "./context/AuthContext";

export default function Home() {
  return (
    <div >
      <main>
        <AuthProvider>
    <RegisterPage/>
        </AuthProvider>
   
      </main>
    </div>
  );
}
