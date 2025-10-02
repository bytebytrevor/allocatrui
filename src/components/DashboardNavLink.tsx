import { NavLink } from "react-router-dom";

type Props = {
    label: string;
    href: string;
    icon?: React.ElementType;
}

function DashboardNavLink({label, href, icon: Icon}: Props) {
    return (
        <NavLink
            end={href === "/dashboard"}
            className={({ isActive }) => {
                    return`flex gap-2 py-2 pl-4 ${isActive ? "bg-[#DEDA00] text-[#033D4F]" : ""}`
                }
            }
            to={href}
        >
            {Icon && <Icon />} {label}
        </NavLink>
    )

}

export default DashboardNavLink;