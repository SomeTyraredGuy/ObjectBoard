import { KonvaEventObject } from "konva/lib/Node"

function onMouseEnter(e: KonvaEventObject<MouseEvent>) {
  const stage = e.target.getStage()
  if (!stage) return
  stage.container().style.cursor = "move"
}

function onMouseLeave(e: KonvaEventObject<MouseEvent>) {
  const stage = e.target.getStage()
  if (!stage) return
  stage.container().style.cursor = "default";
}

export { onMouseEnter, onMouseLeave }