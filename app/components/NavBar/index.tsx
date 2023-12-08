import NavList from "../NavList/navlist";

const NavBar = () => {
  
  return (
    <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:flex flex-shrink-0 shadow-lg">
      <NavList />
    </aside>
  );
};

export default NavBar;
