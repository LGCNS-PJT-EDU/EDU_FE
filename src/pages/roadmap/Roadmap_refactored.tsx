import { useRoadmapStore } from "@/store/roadmapStore";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableNode from "@/pages/roadmap/DraggableNode";
import { useCallback } from "react";

function Roadmap2() {
  const nodes = useRoadmapStore((s) => s.nodes);
  const reorderNode = useRoadmapStore((s) => s.reorderNode);

  const handleMoveNode = useCallback((fromIndex: number, toIndex: number) => {
    reorderNode(fromIndex, toIndex);
  }, [reorderNode]);

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <h1 className="text-center text-2xl font-bold drop-shadow mb-6">맞춤 로드맵</h1>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <p className="text-center text-gray-500 mb-4">
          아래 항목들을 드래그하여 순서를 변경할 수 있습니다
        </p>
        
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-col gap-4">
            {nodes.length === 0 ? (
              <div className="text-center p-8 text-gray-400 border border-dashed rounded-lg">
                로드맵 항목이 없습니다
              </div>
            ) : (
              nodes.map((node, index) => (
                <DraggableNode 
                  key={node.id} 
                  node={node} 
                  index={index} 
                  moveNode={handleMoveNode}
                />
              ))
            )}
          </div>
        </DndProvider>
      </div>
    </div>
  );
}

export default Roadmap2;
