import Hero from "./component/Hero";
import Topnav from "./component/Topnav";


export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Topnav />
      <Hero />
    </div>
  );
}
