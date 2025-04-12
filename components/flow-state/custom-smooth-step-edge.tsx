import { getSmoothStepPath } from "reactflow"

const foreignObjectSize = 40

function CustomSmoothStepEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <>
      <path id={id} className="react-flow__edge-path stroke-gray-600" d={edgePath} />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="overflow-visible"
      >
        <label className="bg-red-500 text-white p-2 rounded text-sm">{data?.text}</label>
      </foreignObject>
    </>
  )
}

export default CustomSmoothStepEdge
