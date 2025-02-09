import Topnav from "../component/Topnav";

const Login = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col overflow-y-auto">
      <Topnav />
      <div className="mt-16 flex justify-center items-center p-4">
        <div
          className="border border-black w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] 
                     min-h-[30%] sm:min-h-[40%] md:min-h-[50%] lg:min-h-[60%] xl:min-h-[70%] 
                     p-6 bg-gray-100"
        >
          <div className="w-full space-y-4">
            <label className="input input-bordered flex items-center gap-2">
              Name
              <input type="text" className="grow" placeholder="Daisy" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Email
              <input type="text" className="grow" placeholder="daisy@site.com" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <input type="text" className="grow" placeholder="Search" />
              <kbd className="kbd kbd-sm">⌘</kbd>
              <kbd className="kbd kbd-sm">K</kbd>
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <input type="text" className="grow" placeholder="Search" />
              <span className="badge badge-info">Optional</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
