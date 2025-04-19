import React from "react";

type Props = {
	avatars: string[];
};

const MembersIcon = React.forwardRef<HTMLDivElement, Props & React.HTMLAttributes<HTMLDivElement>>(
	({ avatars, ...rest }, ref) => {
		const className = "w-10 h-10 absolute rounded-full border border-secondary";

		return (
			<div className="relative h-full w-full" ref={ref} {...rest}>
				<img className={`bottom-1 right-1 ${className}`} src={avatars[2]} />
				<img className={`left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`} src={avatars[1]} />
				<img className={`left-1 top-1 ${className}`} src={avatars[0]} />
			</div>
		);
	},
);

MembersIcon.displayName = "MembersIcon";

export default MembersIcon;
