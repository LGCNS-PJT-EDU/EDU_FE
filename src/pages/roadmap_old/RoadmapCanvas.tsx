import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import carrot from '@/asset/img/roadmap/background/roadmap_carrot_final.png';
import { useRoadmapStore } from '@/store/roadmapStore';
import NodeItem from './NodeItem';
import SlotPlaceholder from './SlotPlaceholder';
import { SLOTS } from '@/pages/roadmap_old/slots';

export default function RoadmapCanvas() {
  const nodes = useRoadmapStore((s) => s.nodes);

  const canvasWidth = useRoadmapStore((s) => {
    if (!s.nodes.length) return 1050;
    const lastIdx = Math.min(s.nodes.length - 1, SLOTS.length - 1);
    return SLOTS[lastIdx].x + 150;
  });

  const bgCount = Math.ceil(canvasWidth / 1024);
  const lastClip = canvasWidth - (bgCount - 1) * 1024;

  return (
    <div className="w-full pt-20">
      <div className="overflow-x-auto h-[720px]">
        <div className="relative" style={{ width: canvasWidth, height: 700 }}>
          <div className="absolute inset-0 flex z-0 pointer-events-none h-full">
            {Array.from({ length: bgCount }).map((_, i) => {
              const isLast = i === bgCount - 1;

              /* 마지막 이미지만 “오른쪽 잘라서” */
              if (isLast) {
                return (
                  <div
                    key={i}
                    className="h-full overflow-hidden flex-none"
                    style={{ width: lastClip }}
                  >
                    <img
                      src={carrot}
                      className="h-full w-[1024px] min-w-[1024px] object-left select-none"
                    />
                  </div>
                );
              }
              return (
                <img
                  key={i}
                  src={carrot}
                  className="h-full w-[1024px] min-w-[1024px] flex-none select-none"
                />
              );
            })}
          </div>

          <DndProvider backend={HTML5Backend}>
            {SLOTS.map((_, i) => (
              <SlotPlaceholder key={i} index={i} />
            ))}
            {nodes.map((n, i) => (
              <NodeItem key={n.id} node={n} index={i} />
            ))}
          </DndProvider>
        </div>
      </div>
    </div>
  );
}
