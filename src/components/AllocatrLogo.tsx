import allocatrLogoLight from "../assets/allocatr-neg-light.svg";
import allocatrLogoDark from "../assets/allocatr-dark-02.svg";

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