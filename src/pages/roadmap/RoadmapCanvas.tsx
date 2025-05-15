import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import carrot from '@/asset/img/roadmap/background/roadmap_carrot_final.png';
import forest from '@/asset/img/roadmap/background/roadmap_forest.png';
import building from '@/asset/img/roadmap/background/roadmap_building.png';
import dessert from '@/asset/img/roadmap/background/roadmap_dessert.png';
import mushroom from '@/asset/img/roadmap/background/roadmap_mushroom.png';
import snow from '@/asset/img/roadmap/background/roadmap_snow.png';
import { useRoadmapStore } from "@/store/roadmapStore";
import NodeItem from "./NodeItem";
import SlotPlaceholder from "./SlotPlaceholder";
import { SLOTS } from "@/pages/roadmap/slots";

export default function RoadmapCanvas() {
  const nodes = useRoadmapStore((s) => s.nodes);
  const slots = SLOTS;

  return (
    <div className="w-full pt-20">
      <div className="overflow-x-auto mx-auto" style={{ width: 1050, height: 720 }} >
        <div className="relative" style={{ width: 1400, height: 700 }}>
          <div className="absolute inset-0 flex z-0 pointer-events-none h-full">
            <img src={carrot} className="h-full" />
            <img src={carrot} className="h-full" />
            <img src={carrot} className="h-full" />
          </div>
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
