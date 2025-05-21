import { UserCircleIcon } from "lucide-react";
import React from "react";

type Props = {
	avatars: string[];
};

const MembersIcon = React.forwardRef<HTMLDivElement, Props & React.HTMLAttributes<HTMLDivElement>>(
	({ avatars, ...rest }, ref) => {
		const className = "size-10 absolute rounded-full border border-secondary bg-background group-hover:bg-primary";

		return (
			<div className="group relative h-full w-full" ref={ref} {...rest}>
				{avatars.length > 1 && <UserCircleIcon className={`left-1 top-1 ${className}`} />}
				{(avatars.length > 3 || avatars.length === 1) && (
					<UserCircleIcon className={`left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`} />
				)}
				{avatars.length >= 2 && <UserCircleIcon className={`bottom-1 right-1 ${className}`} />}
			</div>
		);
	},
);

MembersIcon.displayName = "MembersIcon";

export default MembersIcon;
