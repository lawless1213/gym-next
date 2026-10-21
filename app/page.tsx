// Server component: page metadata only. The page itself is client-side (data needs the
// signed-in Firebase user, which exists only in the browser).
import HomePage from "@/components/home/HomePage";

export default function Page() {
  return <HomePage />;
}
