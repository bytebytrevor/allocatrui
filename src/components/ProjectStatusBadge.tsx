import { Button } from "./ui/button";

type Props = {
    icon?: React.ElementType;    
    label: string;
    color?: string;
    bg?: string;
}

function ProjectStatusBadge({ icon: Icon, label, bg, color }: Props) {
    return (
        <Button className={`flex items-center justify-center gap-2 bg-transparent border-2 text-${color} py-[0.1px] px-3 rounded-full`}>
            {Icon && <Icon size={12} className="font-light" />}
            <span className="text-xs">{label}</span>
        </Button>
    );
}

export default ProjectStatusBadge;