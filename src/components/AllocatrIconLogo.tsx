import allocatrLogoLight from "../assets/icon-variant-01.svg";
import allocatrLogoDark from "../assets/icon-variant-02.svg";

type Props = {
    theme: string;
    className?: string;
}

function AllocatrLogo({theme, className}: Props) {
    const logo = theme == "dark" ? allocatrLogoLight : allocatrLogoDark;
    return (
        <img src={logo} alt="Allocatr logo" className={`${className ?? "w-24"}`}/>
    );
}

export default AllocatrLogo;