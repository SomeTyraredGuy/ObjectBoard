import React from "react";
import { useTranslation } from "react-i18next";

function Loader() {
	const { t } = useTranslation("translation", { keyPrefix: "common" });
	return (
		<div className="bg-background flex h-screen w-screen flex-col items-center justify-center">
			<div className="border-primary border-30 mx-auto h-40 w-40 animate-[spin_2s_ease-in-out_infinite] rounded-full border-dotted"></div>
			<h2 className="mt-6 flex flex-row text-6xl text-zinc-900 dark:text-white">{t("loading")}</h2>
		</div>
	);
}

export default Loader;
