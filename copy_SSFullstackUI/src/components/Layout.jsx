import { Link, useLocation } from "react-router-dom";
import { 
  HouseFill, 
  Globe, 
  Map, 
  MapFill, 
  ImageFill, 
  CircleHalf, 
  Search, 
  ListOl, 
  FileEarmarkArrowDownFill, 
  CheckSquareFill, 
  MenuButtonWideFill 
} from "react-bootstrap-icons";

function Layout({ children }) {
  const location = useLocation();

  const navItemClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4 sticky top-0 shadow flex items-center">
        <h1 className="text-lg font-bold m-0">SS Intern</h1>
      </header>

      {/* Sidebar + Main */}
      <div className="flex flex-grow">
        
        {/* Sidebar */}
        <aside className="bg-white border-r w-60 p-4 shadow-sm flex flex-col">
          <h6 className="uppercase text-gray-500 mb-3 pl-2 text-xs font-semibold">
            Navigation
          </h6>
          
          <nav className="flex flex-col gap-1">
            <Link to="/" className={navItemClass("/")}>
              <HouseFill size={16} /> Language
            </Link>
            <Link to="/country" className={navItemClass("/country")}>
              <Globe size={16} /> Country
            </Link>
            <Link to="/state" className={navItemClass("/state")}>
              <Map size={16} /> State
            </Link>
            <Link to="/district" className={navItemClass("/district")}>
              <MapFill size={16} /> District
            </Link>
            <Link to="/imageupload" className={navItemClass("/imageupload")}>
              <ImageFill size={16} /> Image Upload
            </Link>
            <Link to="/radiobutton" className={navItemClass("/radiobutton")}>
              <CircleHalf size={16} /> Radio Button
            </Link>
            <Link to="/searching" className={navItemClass("/searching")}>
              <Search size={16} /> Searching
            </Link>
            <Link to="/pagination" className={navItemClass("/pagination")}>
              <ListOl size={16} /> Pagination
            </Link>
            <Link to="/exportcsv" className={navItemClass("/exportcsv")}>
              <FileEarmarkArrowDownFill size={16} /> Export CSV
            </Link>
            <Link to="/checkbox" className={navItemClass("/checkbox")}>
              <CheckSquareFill size={16} /> Check Box
            </Link>
            <Link to="/multiselectdropdown" className={navItemClass("/multiselectdropdown")}>
              <MenuButtonWideFill size={16} /> Multi Select DDL
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 bg-gray-100">
          <div className="bg-white shadow rounded-xl p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
