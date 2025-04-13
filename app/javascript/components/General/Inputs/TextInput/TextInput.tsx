import React from "react";
import classes from "./TextInput.module.css";

type Props = {
	className: string;
	name: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
};

function TextInput({ className, name, onChange, placeholder = "Write here..." }: Props) {
	return (
		<div className={`${classes.customInput} ${className}`}>
			<label className={`text ${classes.text}`}>{name}:</label>
			<input
				type="text"
				onChange={onChange}
				placeholder={placeholder}
				name="input"
				className={`input ${classes.input}`}
			/>
		</div>
	);
}

export default TextInput;
