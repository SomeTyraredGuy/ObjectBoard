import Konva from "konva";
import { useRef } from "react";

function downloadURI(uri, name) {
	const link = document.createElement("a");
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

type Props = {
	stageScale: number;
	stagePosition: { x: number; y: number };
};

export default function UseExport({ stageScale, stagePosition }: Props) {
	const stage = useRef<Konva.Stage>(null);
	const objectsLayer = useRef<Konva.Layer>(null);

	const handleExport = () => {
		if (!stage.current || !objectsLayer.current) {
			console.error("Original stage or objectsLayer ref is not available.");
			return;
		}

		const contentRect = objectsLayer.current.getClientRect();

		if (!contentRect || contentRect.width === 0 || contentRect.height === 0) {
			console.warn("Content rectangle has zero width or height, or is invalid. Cannot export.");
			return;
		}
		const height = contentRect.height / stageScale;
		const width = contentRect.width / stageScale;

		const offScreenStage = new Konva.Stage({
			container: document.createElement("div"),
			width: width,
			height: height,
			x: 0,
			y: 0,
		});

		const clonedLayer = objectsLayer.current.clone();

		clonedLayer.position({
			x: (-contentRect.x + stagePosition.x) / stageScale,
			y: (-contentRect.y + stagePosition.y) / stageScale,
		});

		offScreenStage.add(clonedLayer);
		const background = new Konva.Rect({
			x: 0,
			y: 0,
			width: width,
			height: height,
			fill: "white",
			opacity: 1,
		});
		const backgroundLayer = new Konva.Layer();
		offScreenStage.add(backgroundLayer.add(background));
		backgroundLayer.moveToBottom();

		const exportPixelRatio = 2;
		const uri = offScreenStage.toDataURL({
			x: 0,
			y: 0,
			width: width,
			height: height,
			pixelRatio: exportPixelRatio,
		});

		downloadURI(uri, "exported_stage.png");
		offScreenStage.destroy();
	};

	return {
		stageRef: stage,
		objectsLayerRef: objectsLayer,
		handleExport,
	};
}
