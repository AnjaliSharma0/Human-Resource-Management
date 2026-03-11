import Image from "next/image";
import LoginPage from "./login/page";
import EmployeeProfilePage from "./employee/[id]/page";

export default function Home() {
  return (
    <div>
      <main>
      <LoginPage/>
    
      </main>
    </div>
  );
}
