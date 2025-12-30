// import React, { useRef, useEffect } from 'react';
// import { useVirtualizer } from '@tanstack/react-virtual';
// import { TaskCard } from '../TaskCard';
// import { TaskListItem } from '@/types/api';
// import { LoadingSpinner } from '@/components/common/LoadingSpinner';
//
// export interface VirtualizedTaskListProps {
//   tasks: TaskListItem[];
//   onTaskClick: (id: string) => void;
//   onLoadMore: () => void;
//   hasNextPage: boolean;
//   isLoadingMore: boolean;
// }
//
// export const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
//   tasks,
//   onTaskClick,
//   onLoadMore,
//   hasNextPage,
//   isLoadingMore,
// }) => {
//   const parentRef = useRef<HTMLDivElement>(null);
//
//   const virtualizer = useVirtualizer({
//     count: tasks.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 100,
//     overscan: 5,
//   });
//
//   const items = virtualizer.getVirtualItems();
//   const lastItem = items[items.length - 1];
//
//   // Infinite scroll: load more when scrolling to bottom
//   useEffect(() => {
//     if (!lastItem) return;
//
//     if (
//       lastItem.index >= tasks.length - 1 &&
//       hasNextPage &&
//       !isLoadingMore
//     ) {
//       onLoadMore();
//     }
//   }, [lastItem, hasNextPage, isLoadingMore, tasks.length, onLoadMore]);
//
//   return (
//     <div
//       ref={parentRef}
//       className="h-[calc(100vh-250px)] overflow-auto border border-gray-200 rounded-lg p-4"
//       style={{ contain: 'strict' }}
//     >
//       <div
//         style={{
//           height: `${virtualizer.getTotalSize()}px`,
//           width: '100%',
//           position: 'relative',
//         }}
//       >
//         {virtualizer.getVirtualItems().map((virtualRow) => {
//           const task = tasks[virtualRow.index];
//           if (!task) return null;
//
//           return (
//             <div
//               key={task.id}
//               style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 height: `${virtualRow.size}px`,
//                 transform: `translateY(${virtualRow.start}px)`,
//               }}
//             >
//               <TaskCard
//                 task={task}
//                 onClick={() => onTaskClick(task.id)}
//               />
//             </div>
//           );
//         })}
//       </div>
//       {isLoadingMore && (
//         <div className="text-center py-4">
//           <LoadingSpinner />
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TaskCard } from '../TaskCard';
import type { TaskListItem } from '@/types/api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export interface VirtualizedTaskListProps {
  tasks: TaskListItem[];
  onTaskClick: (id: string) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoadingMore: boolean;
}

export const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
                                                                          tasks,
                                                                          onTaskClick,
                                                                          onLoadMore,
                                                                          hasNextPage,
                                                                          isLoadingMore,
                                                                        }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // 객체 대신 원시값(index)만 추출
  const lastItemIndex = virtualItems[virtualItems.length - 1]?.index;

  // Infinite scroll: load more when scrolling to bottom
  useEffect(() => {
    if (lastItemIndex === undefined) return;

    // 마지막 아이템에 도달했는지 확인
    if (
        lastItemIndex >= tasks.length - 1 &&
        hasNextPage &&
        !isLoadingMore
    ) {
      onLoadMore();
    }
  }, [lastItemIndex, hasNextPage, isLoadingMore, tasks.length, onLoadMore]);

  return (
      <div
          ref={parentRef}
          className="h-[calc(100vh-250px)] overflow-auto border border-gray-200 rounded-lg p-4"
          style={{ contain: 'strict' }}
      >
        <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
        >
          {virtualItems.map((virtualRow) => {
            const task = tasks[virtualRow.index];
            if (!task) return null;

            return (
                <div
                    key={task.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                >
                  <TaskCard
                      task={task}
                      onClick={() => onTaskClick(task.id)}
                  />
                </div>
            );
          })}
        </div>
        {isLoadingMore && (
            <div className="text-center py-4">
              <LoadingSpinner />
            </div>
        )}
      </div>
  );
};
