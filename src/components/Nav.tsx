import { Link } from 'react-router';

export default function Nav() {
  return (
    <nav className="bg-blue-100 py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/">
          <img
            className="h-8 w-8"
            width="32"
            height="32"
            src="/github-logo.svg"
            alt="github-logo"
          />
        </Link>
        <ul className="flex">
          <NavItem name="Homepage" path="/" />
          <NavItem name="Search" path="/search" />
        </ul>
      </div>
    </nav>
  );
}

type NavItemProps = {
  path: string;
  name: string;
};
function NavItem({ path, name }: NavItemProps) {
  return (
    <li>
      <Link className="rounded p-4 duration-200 hover:bg-blue-200" to={path}>
        {name}
      </Link>
    </li>
  );
}
