// import { NavLink } from "react-router-dom";

// type Props = {
//     label: string;
//     href: string;
//     icon?: React.ElementType;
// }

// function DashboardNavLink({label, href, icon: Icon}: Props) {
//     return (
//         <NavLink
//             end
//             className={({ isActive }) => {
//                 return`text-sm text-foreground/60 font-medium flex items-center gap-2 py-2 pl-4 hover:bg-foreground/10
//                     ${isActive
//                     ? 
//                         // "text-sm text-brand-primary font-semibold border-r-4 border-brand-primary"
//                         "text-sm text-foreground/90 font-semibold border-r-4 border-primary"
//                     :                        
//                         ""
//                     }`
//                 }
//             }
//             to={href}
//         >
//             {Icon && <Icon />} {label}
//         </NavLink>
//     )

// }

// export default DashboardNavLink;

import { NavLink } from "react-router-dom";

type Props = {
  label: string;
  href: string;
  icon?: React.ElementType;
};

function DashboardNavLink({
  label,
  href,
  icon: Icon,
}: Props) {
  return (
    <NavLink
      end
      to={href}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3",
          "rounded-l-xl border-r-[3px] px-3 py-2.5",
          "text-sm font-medium",
          "transition-colors duration-200",

          isActive
            ? [
                "border-primary",
                "font-semibold",
                "text-foreground",
              ].join(" ")
            : [
                "border-transparent",
                "text-muted-foreground",
                "hover:bg-muted/25",
                "hover:text-foreground",
              ].join(" "),
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              className={[
                "h-4 w-4 shrink-0",
                "transition-colors duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground",
              ].join(" ")}
            />
          )}

          <span className="min-w-0 truncate">
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

export default DashboardNavLink;