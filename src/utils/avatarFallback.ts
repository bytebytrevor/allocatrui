import type { Allocat } from "@/Types/allocat";
import type { User } from "@/Types/user"

export function avatarFallback(user: Allocat | User) {
        const fullname = user.fullName.split(' ');
        return (
            fullname.length > 1
            ? `${fullname[0].charAt(0)}${fullname[1].charAt(0)}`
            : `${fullname[0].charAt(0)}`
        );
    }