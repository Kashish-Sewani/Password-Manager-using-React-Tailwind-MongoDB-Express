const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 md:w-full  w-[650px]">
      <div className="flex justify-between items-center w-full">
        <div className="logo text-white font-bold text-2xl w-full">
          PassSecure
        </div>
        <button className="flex items-center text-white bg-blue-500 hover:bg-blue-700 transition-colors duration-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300">
          <img className="mr-2" width={25} src="icons/github.svg" alt="GitHub logo" />
          GitHub
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
