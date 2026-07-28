import { Link } from "react-router-dom";

const footerLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "How it works",
    href: "/how-it-works",
  },
  {
    label: "Terms",
    href: "/terms",
  },
  {
    label: "Privacy",
    href: "/privacy",
  },
];

function SiteFooter() {
  return (
    <footer className="bg-background px-5 py-8 text-foreground transition-colors sm:py-10 md:px-8">
      <div className="container mx-auto flex flex-col gap-6 border-t border-border pt-8 text-sm md:flex-row md:items-center md:justify-between">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} Allocatr. Work, properly allocated.
        </p>

        <nav
          className="flex flex-wrap gap-x-5 gap-y-3 sm:gap-x-6"
          aria-label="Footer navigation"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default SiteFooter;