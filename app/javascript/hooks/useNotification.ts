import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type Props = {
	isError?: boolean;
	error?: Error;
	isSuccess?: boolean;
	successMessage?: string;
};

export default function useNotification({ isError, isSuccess, error, successMessage }: Props) {
	const { t } = useTranslation("translation", { keyPrefix: "common.notification" });
	useEffect(() => {
		if (isSuccess) {
			toast.success(t("success"), {
				description: successMessage,
			});
		}
		if (isError) {
			toast.error(t("error"), {
				description: error?.message,
			});
		}
	}, [isSuccess, isError]);
}
