import { type ComponentType } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  end?: boolean;
};

function DashboardNavLink({ href, icon: Icon, label, end = false }: Props) {
  return (
    <NavLink
      to={href}
      end={end}
      className={({ isActive }) =>
        [
          "group relative flex min-h-10 items-center gap-3 rounded-xl px-2.5 py-2",
          "text-[0.72rem] font-medium transition-colors duration-200",
          isActive
            ? [
                "bg-[#D5E3DF] text-[#294D56]",
                "dark:bg-white/[0.055] dark:text-white",
              ].join(" ")
            : [
                "text-[#66777B] hover:bg-[#DCE7E3] hover:text-[#315E6C]",
                "dark:text-white/34 dark:hover:bg-white/[0.035] dark:hover:text-white/72",
              ].join(" "),
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={[
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              "transition-colors duration-200",
              isActive
                ? [
                    "bg-[#315E6C] text-white",
                    "dark:bg-[#DEDA00] dark:text-[#303030]",
                  ].join(" ")
                : [
                    "bg-[#DDE7E4] text-[#647A7F]",
                    "group-hover:text-[#315E6C]",
                    "dark:bg-white/[0.035] dark:text-white/30",
                    "dark:group-hover:text-white/65",
                  ].join(" "),
            ].join(" ")}
          >
            <Icon size={13} />
          </span>

          <span className="truncate">{label}</span>

          {isActive && (
            <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#315E6C] dark:bg-[#DEDA00]" />
          )}
        </>
      )}
    </NavLink>
  );
}

export default DashboardNavLink;