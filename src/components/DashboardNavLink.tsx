import { NavLink } from "react-router-dom";

type Props = {
    label: string;
    href: string;
    icon?: React.ElementType;
    // projectId?: string;
}

function DashboardNavLink({label, href, icon: Icon}: Props) {
    return (
        <NavLink
            end
            className={({ isActive }) => {
                    return`flex items-center gap-2 py-2 pl-4 ${isActive ? "bg-primary text-secondary" : ""}`
                }
            }
            to={href}
        >
            {Icon && <Icon />} {label}
        </NavLink>
    )

}

export default DashboardNavLink;