import type { AllocatProfile } from "@/Types/allocatProfile";
import type { User } from "@/Types/user"

export function avatarFallback(user: AllocatProfile | User) {
    // const fullname = user.fullName.split(' ');
    return (
        "A"
        // fullname.length > 1
        // ? `${fullname[0].charAt(0)}${fullname[1].charAt(0)}`
        // : `${fullname[0].charAt(0)}`
    );
}