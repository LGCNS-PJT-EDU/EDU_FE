import { useDrag, useDrop } from 'react-dnd';
import { NodeData } from '@/store/roadmapStore';
import { useRef, useState } from 'react';
import type { DropTargetMonitor } from 'react-dnd';
import { SUBJECT_IMAGES } from './subjectImages';

interface DraggableNodeProps {
  node: NodeData;
  index: number;
  moveNode: (dragIndex: number, hoverIndex: number) => void;
}

export const ItemTypes = {
  NODE: 'node',
};

interface DragItem {
  index: number;
  type: string;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ node, index, moveNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.NODE,
    item: () => ({ 
      index,
      type: ItemTypes.NODE
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    options: {
      dropEffect: 'move',
    },
  });

  const [{ handlerId, isOverCurrent }, drop] = useDrop({
    accept: ItemTypes.NODE,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
      isOverCurrent: monitor.isOver(),
    }),
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) {
        return;
      }
      
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset) {
        return;
      }
      
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      moveNode(dragIndex, hoverIndex);
      
      item.index = hoverIndex;
      
      setIsOver(true);
    },
    drop: () => {
      setIsOver(false);
    }
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`p-5 rounded-xl shadow-md border-2 transition-all duration-300 ${
        isDragging 
          ? 'opacity-60 scale-105 shadow-xl border-blue-400 bg-blue-50' 
          : isOverCurrent 
            ? 'border-green-500 shadow-lg bg-green-50 transform translate-y-1' 
            : 'border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:bg-indigo-50'
      } cursor-grab active:cursor-grabbing`}
      style={{
        transform: isDragging ? 'rotate(3deg)' : 'rotate(0deg)',
      }}
    >
      <div className="flex items-center gap-4">
        <div className="text-gray-500 flex-shrink-0 p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-grow font-semibold text-lg text-gray-800">{node.label}</div>
        <div className="flex-shrink-0 bg-white p-1 rounded-full shadow-sm border border-gray-200">
          <img
            src={SUBJECT_IMAGES[node.label]}
            alt={node.label}
            className="w-14 h-14 object-contain rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default DraggableNode; 