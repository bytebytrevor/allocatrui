type Props = {
    icon?: React.ElementType;    
    label: string;
    color: string;
    bg: string;
}

function ProjectStatusBadge({ icon: Icon, label, bg, color }: Props) {
    return (
        <div className={`flex items-center justify-center gap-2 bg-${bg}/20 text-${color} py-2 px-4 rounded-[4px]`}>
            {Icon && <Icon size={12} strokeWidth={3} className="font-bold" />}
            <span className="text-sm">{label}</span>
        </div>
    );
}

export default ProjectStatusBadge;