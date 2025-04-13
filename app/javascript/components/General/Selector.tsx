import React from "react";

type Props = {
	options: { name: string; disabled?: boolean }[];
	currentOption: string;
	setOption: (option: string) => void;
	className?: string;
	disabled?: boolean;
};

function Selector({ options, currentOption, setOption, className = "", disabled = false }: Props) {
	return (
		<div className={`dropdown ${className}`}>
			<button
				className="btn btn-secondary dropdown-toggle"
				disabled={disabled}
				type="button"
				data-bs-toggle="dropdown"
				aria-expanded="false"
				style={{ minWidth: "150px" }}
			>
				{currentOption}
			</button>
			<ul className="dropdown-menu">
				{options.map((option, i) => (
					<li key={i}>
						<button className="dropdown-item" disabled={option.disabled} onClick={() => setOption(option.name)}>
							{option.name}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Selector;
