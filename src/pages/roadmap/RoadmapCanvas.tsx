import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import carrot from '@/asset/img/roadmap/roadmap_carrot.png';
import forest from '@/asset/img/roadmap/roadmap_forest.png';
import building from '@/asset/img/roadmap/roadmap_building.png';
import dessert from '@/asset/img/roadmap/roadmap_dessert.png';
import mushroom from '@/asset/img/roadmap/roadmap_mushroom.png';
import snow from '@/asset/img/roadmap/roadmap_snow.png';
import { useRoadmapStore } from "@/store/roadmapStore";
import NodeItem from "./NodeItem";
import SlotPlaceholder from "./SlotPlaceholder";
import { SLOTS } from "@/pages/roadmap/slots";

export default function RoadmapCanvas() {
  const nodes = useRoadmapStore((s) => s.nodes);
  const slots = SLOTS;

  return (
    <div className="w-full pt-10">
      <div className="overflow-x-auto mx-auto" style={{ width: 1050, height: 720 }} >
        <div className="relative" style={{ width: 1400, height: 700 }}>
          <div className="absolute inset-0 flex z-0 pointer-events-none h-full">
            <img src={forest} className="h-full" />
            <img src={snow} className="h-full" />
            <img src={dessert} className="h-full" />
            <img src={building} className="h-full" />
            <img src={mushroom} className="h-full" />
            <img src={carrot} className="h-full" />
          </div>
        <svg className="absolute inset-0 h-full w-full z-0" fill="none" strokeWidth={6} stroke="#d1d5db">
          <path
            d={slots.map((s, i) => `${i === 0 ? "M" : "L"}${s.x} ${s.y}`).join(" ")}
            strokeLinecap="round"
          />
        </svg>
        <DndProvider backend={HTML5Backend}>
          {slots.map((_, i) => (
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
