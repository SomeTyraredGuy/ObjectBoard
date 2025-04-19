import { RefObject, useRef, useState } from "react";
import { ChangeRecord, HistoryRecord } from "../../../Types/History";
import useTimeout from "../../UseTimeout";
import { useMutation } from "@tanstack/react-query";
import { getCSRFToken, getBaseURL } from "../../../scripts/requestUtils";
import { CanvasObject, isCanvasObject } from "../../../Types/CanvasObjects";

type Props = {
	noChanges: (changeRecord: ChangeRecord) => boolean;
	changeObjects: RefObject<(HistoryRecord: HistoryRecord, useNewProp?: boolean) => void>;
};

export default function UseCanvasContentMutation({ noChanges, changeObjects }: Props) {
	const unsavedRecord = useRef<HistoryRecord>([]);
	const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
	const localIDs = useRef<number[]>([]);

	function getJSONRecord() {
		const del: number[] = [];
		const create: CanvasObject[] = [];
		localIDs.current = [];
		const update: { id: number; type: string; newProperties: Partial<CanvasObject> }[] = [];

		unsavedRecord.current.forEach((record) => {
			if (record.newProperties === null) del.push(record.id);
			else if (record.oldProperties === null && record.newProperties.id < 0 && isCanvasObject(record.newProperties)) {
				localIDs.current.push(record.newProperties.id);
				create.push(record.newProperties);
			} else
				update.push({
					id: record.id,
					type: record.type,
					newProperties: record.newProperties,
				});
		});

		const recordToSend = {
			record: {
				create: create,
				delete: del,
				update: update,
			},
		};

		unsavedRecord.current = [];

		return JSON.stringify(recordToSend);
	}

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: async () => {
			const response = await fetch(`${getBaseURL()}/content/save`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					"X-CSRF-Token": getCSRFToken(),
				},
				body: getJSONRecord(),
			});

			const resp = await response.json();
			if (!resp.assigned_IDs) {
				if (resp.error) throw new Error(resp.error);
				throw new Error();
			} else {
				if (resp.assigned_IDs.length === 0) return;

				if (resp.assigned_IDs.length !== localIDs.current.length) throw new Error();
				if (resp.assigned_IDs.some((id) => id < 0)) throw new Error();

				changeObjects.current(
					localIDs.current.map((id, i) => ({
						id: id,
						type: "assignID",
						oldProperties: { id: id },
						newProperties: { id: resp.assigned_IDs[i] },
					})),
					true
				);
				unsavedRecord.current.forEach((record) => {
					// assign new IDs to records that were created before response
					if (record.id < 0) {
						const index = localIDs.current.indexOf(record.id);
						if (index !== -1) record.id = resp.assigned_IDs[index];
					}
				});
			}
		},
		onSuccess: () => {
			setUnsavedChanges(false);
		},
	});

	const { startTimeout, clearTimer: clearTimeout } = useTimeout({
		delay: 2000, // 2 seconds
		callback: () => {
			if (isPending) {
				startTimeout();
				return;
			}

			clearMaxTimeout();
			mutate();
		},
	});

	const { startTimeout: startMaxTimeout, clearTimer: clearMaxTimeout } = useTimeout({
		delay: 15000, // 15 seconds
		callback: () => {
			clearTimeout();
			mutate();
		},
	});

	function addChanges(changes: HistoryRecord) {
		if (unsavedRecord.current.length === 0) {
			unsavedRecord.current = changes;
			startMaxTimeout();
		} else {
			changes.forEach((change) => {
				const index = unsavedRecord.current.findIndex((c) => c.id === change.id);

				if (index === -1) {
					unsavedRecord.current.push(change);
					return;
				}

				unsavedRecord.current[index] = {
					...unsavedRecord.current[index],
					newProperties: {
						...unsavedRecord.current[index].newProperties,
						...change.newProperties,
					},
				};

				if (noChanges(unsavedRecord.current[index])) {
					unsavedRecord.current.splice(index, 1); // no need to send anything
				}
			});
		}

		if (unsavedRecord.current.length > 0) {
			setUnsavedChanges(true);
			startTimeout();
		} else setUnsavedChanges(false);
	}

	window.addEventListener("beforeunload", () => {
		if (!unsavedChanges) return;

		clearTimeout();
		clearMaxTimeout();
		mutate();
	});

	return {
		addChanges,
		unsavedChanges,
		isError,
		error,
	};
}
