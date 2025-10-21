import { NavLink } from "react-router-dom";

type Props = {
    label: string;
    href: string;
    icon?: React.ElementType;
}

function DashboardNavLink({label, href, icon: Icon}: Props) {
    return (
        <NavLink
            end
            className={({ isActive }) => {
                return`flex items-center gap-2 py-2 pl-4 hover:bg-accent/40
                    ${isActive
                    ? 
                        "text-primary font-semibold border-r-4 border-primary"
                    :                        
                        ""
                    }`
                }
            }
            to={href}
        >
            {Icon && <Icon />} {label}
        </NavLink>
    )

}

export default DashboardNavLink;