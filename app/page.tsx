import { redirect } from "next/navigation";

export default function Home() {
  // Login route removed — redirect users to the main contract app instead
  redirect("/contract");
}
