import React from 'react';
import { 
  LayoutGrid, PieChart, BarChart3, Image as ImageIcon, Music, FolderOpen, Clock, X, 
  ExternalLink, Plus, Trash2, Network, Box, Layers, Wind, Palette, List, Grid, Sun, Moon,
  Edit2, Copy, GripVertical, Check, AlertCircle, CheckCircle2, StickyNote, Link,
  Send, Download, RotateCcw, Calendar, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Maximize2, Minimize2,
  MousePointer2, Square, Circle, Triangle, Type, ArrowRight, MousePointer, Pin,
  Minus, RotateCw, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

import { Scene, TabType, EditorNode } from './types';
import { MOCK_SCENES } from './data';
import { cn } from './lib/utils';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, isDarkMode }: { icon: any, label: string, active: boolean, onClick: () => void, isDarkMode: boolean }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center w-20 h-20 transition-all duration-300 rounded-2xl mb-2",
      active 
        ? (isDarkMode ? "bg-white/10 text-white shadow-lg" : "bg-blue-500 text-white shadow-lg shadow-blue-500/20") 
        : (isDarkMode ? "text-white/50 hover:text-white hover:bg-white/5" : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100")
    )}
  >
    <Icon size={24} />
    <span className="text-[10px] mt-2 font-medium uppercase tracking-wider">{label}</span>
  </button>
);

const StatusIcons = ({ 
  completed, 
  hasNotes, 
  onToggleCompleted, 
  onToggleNotes, 
  isDarkMode 
}: { 
  completed: boolean, 
  hasNotes: boolean, 
  onToggleCompleted: () => void, 
  onToggleNotes: () => void,
  isDarkMode: boolean
}) => (
  <div className="flex items-center gap-1 ml-1.5">
    <button 
      onClick={(e) => { e.stopPropagation(); onToggleNotes(); }}
      className={cn(
        "p-0.5 rounded-full transition-all duration-300",
        hasNotes 
          ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
          : (isDarkMode ? "text-white/40 hover:text-white/60" : "text-zinc-500 hover:text-zinc-700")
      )}
    >
      <StickyNote size={14} fill={hasNotes ? "currentColor" : "none"} fillOpacity={0.2} />
    </button>
    <button 
      onClick={(e) => { e.stopPropagation(); onToggleCompleted(); }}
      className={cn(
        "p-0.5 rounded-full transition-all duration-300",
        completed 
          ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]" 
          : (isDarkMode ? "text-white/40 hover:text-white/60" : "text-zinc-500 hover:text-zinc-700")
      )}
    >
      <CheckCircle2 size={14} fill={completed ? "currentColor" : "none"} fillOpacity={0.2} />
    </button>
  </div>
);

const CompactSceneProgress = ({ 
  scene, 
  onUpdate, 
  isDarkMode 
}: { 
  scene: Scene, 
  onUpdate: (updated: Scene, originalId: string) => void,
  isDarkMode: boolean
}) => {
  const stages = [
    { id: 'stage3D', label: 'Layout', color: 'blue', status: scene.status.stage3D, file: scene.sceneFile },
    { id: 'lighting', label: 'Lookdev', color: 'orange', status: scene.status.lighting, file: 'lighting_setup.blend' },
    { id: 'rendering', label: 'Render', color: 'emerald', status: scene.status.rendering, file: scene.renderFolder },
    { id: 'compositing', label: 'Comp', color: 'purple', status: scene.status.compositing, file: scene.compFile },
  ];

  return (
    <div className="space-y-2 mt-2">
      <div className={cn(
        "flex h-6 w-full rounded-full p-[2px] transition-all",
        isDarkMode ? "bg-white/5 shadow-inner" : "bg-zinc-100 shadow-inner"
      )}>
        <div className="flex w-full h-full gap-[3px]">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({
                  ...scene,
                  status: {
                    ...scene.status,
                    [stage.id]: {
                      ...scene.status[stage.id as keyof typeof scene.status],
                      completed: !scene.status[stage.id as keyof typeof scene.status].completed
                    }
                  }
                }, scene.id);
              }}
              className={cn(
                "flex-1 h-full transition-all duration-500 rounded-full",
                stage.status.completed 
                  ? (stage.color === 'blue' ? "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" :
                     stage.color === 'orange' ? "bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]" :
                     stage.color === 'emerald' ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" :
                     "bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]") 
                  : (isDarkMode 
                      ? (stage.color === 'blue' ? "border border-blue-500/30" :
                         stage.color === 'orange' ? "border border-orange-500/30" :
                         stage.color === 'emerald' ? "border border-emerald-500/30" :
                         "border border-purple-500/30")
                      : (stage.color === 'blue' ? "border border-blue-300 bg-white" :
                         stage.color === 'orange' ? "border border-orange-300 bg-white" :
                         stage.color === 'emerald' ? "border border-emerald-300 bg-white" :
                         "border border-purple-300 bg-white"))
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-0 pt-0.5">
        {stages.map((stage) => (
          <div key={stage.id} className="flex flex-col items-center">
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-tighter mb-0.5 transition-colors",
              isDarkMode 
                ? (stage.color === 'blue' ? "text-blue-400" : 
                   stage.color === 'orange' ? "text-orange-400" :
                   stage.color === 'emerald' ? "text-emerald-400" :
                   "text-purple-400")
                : (stage.color === 'blue' ? "text-blue-600" : 
                   stage.color === 'orange' ? "text-orange-600" :
                   stage.color === 'emerald' ? "text-emerald-600" :
                   "text-purple-600")
            )}>
              {stage.label}
            </span>
            <button 
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "p-1 rounded-full transition-all group/link",
                isDarkMode ? "hover:bg-white/10 text-white/30 hover:text-white" : "hover:bg-zinc-100 text-zinc-300 hover:text-zinc-600"
              )}
              title={`File: ${stage.file}`}
            >
              <Link size={10} className="transform group-hover/link:scale-110 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const StoryboardCard = ({ 
  scene, 
  onClick, 
  onUpdate, 
  isDarkMode, 
  isEditMode, 
  onDuplicate, 
  onDelete,
  dragHandleProps,
  isDragging,
  viewMode = 'grid'
}: { 
  scene: Scene, 
  onClick: () => void, 
  onUpdate: (updated: Scene, originalId: string) => void, 
  isDarkMode: boolean,
  isEditMode?: boolean,
  onDuplicate?: () => void,
  onDelete?: () => void,
  dragHandleProps?: any,
  isDragging?: boolean,
  viewMode?: 'grid' | 'list' | 'timeline'
}) => {
  if (viewMode === 'list') {
    return (
      <motion.div
        layoutId={scene.id}
        onClick={isEditMode ? undefined : onClick}
        whileHover={isEditMode ? {} : { 
          x: 4,
          boxShadow: isDarkMode ? "0 0 20px rgba(255, 255, 255, 0.08)" : "0 10px 30px rgba(0, 0, 0, 0.1)",
          borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
        }}
        className={cn(
          "flex items-center gap-6 p-4 rounded-xl border border-l-4 transition-all relative group",
          isEditMode ? "cursor-default" : "cursor-pointer",
          isDarkMode ? "bg-zinc-900/50 border-white/5" : "bg-white border-zinc-200 shadow-sm",
          isEditMode && (isDarkMode ? "border-white/20 border-2" : "border-zinc-400 border-2"),
          isDragging && "opacity-50 scale-95 z-50"
        )}
        style={{ borderLeftColor: scene.color }}
      >
        {/* Drag Handle */}
        {isEditMode && (
          <div 
            {...dragHandleProps}
            className={cn(
              "p-1.5 rounded-lg cursor-grab active:cursor-grabbing transition-all",
              isDarkMode ? "bg-zinc-800/80 text-white/60 hover:text-white hover:bg-zinc-700" : "bg-white/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 shadow-sm"
            )}
          >
            <GripVertical size={14} />
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0">
          <img 
            src={scene.thumbnail} 
            alt={scene.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[8px] text-white/90">
            {scene.duration}s
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span style={{ color: scene.color }} className="text-[10px] font-bold uppercase tracking-tight">{scene.id.toUpperCase()}</span>
            <h3 className={cn("text-sm font-bold truncate", isDarkMode ? "text-white" : "text-zinc-900")}>{scene.title}</h3>
          </div>
          <p className={cn("text-[10px] line-clamp-1", isDarkMode ? "text-white/40" : "text-zinc-500")}>
            {scene.description}
          </p>
        </div>

        {/* Compact Progress (New Pill Shape) */}
        <div className="px-4 flex-1 max-w-[240px]">
          <CompactSceneProgress 
            scene={scene} 
            onUpdate={onUpdate} 
            isDarkMode={isDarkMode} 
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "px-3 py-1 border rounded-lg flex items-center gap-1",
            isDarkMode ? "border-green-500/30 bg-green-500/10" : "border-green-200 bg-green-50"
          )}>
            <span className={cn("text-[10px] font-bold", isDarkMode ? "text-green-400" : "text-green-600")}>${scene.cost}</span>
          </div>
          
          {isEditMode && (
            <div className="flex gap-1">
              <button 
                onClick={(e) => { e.stopPropagation(); onDuplicate?.(); }}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  isDarkMode ? "bg-zinc-800/80 text-white/60 hover:text-white hover:bg-zinc-700" : "bg-white/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 shadow-sm"
                )}
              >
                <Copy size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  isDarkMode ? "bg-red-500/20 text-red-400 hover:bg-red-500/40" : "bg-red-50 text-red-600 hover:bg-red-100 shadow-sm"
                )}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (viewMode === 'timeline') {
    return (
      <motion.div
        layoutId={scene.id}
        onClick={isEditMode ? undefined : onClick}
        whileHover={isEditMode ? {} : { 
          scale: 1.02,
          boxShadow: isDarkMode ? "0 0 20px rgba(255, 255, 255, 0.08)" : "0 10px 30px rgba(0, 0, 0, 0.1)",
          borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
        }}
        className={cn(
          "flex-shrink-0 w-64 border border-l-4 rounded-xl overflow-hidden group transition-all duration-300 relative",
          isEditMode ? "cursor-default" : "cursor-pointer",
          isDarkMode ? "bg-zinc-900/50 border-white/5" : "bg-white border-zinc-200 shadow-sm",
          isEditMode && (isDarkMode ? "border-white/20 border-2" : "border-zinc-400 border-2"),
          isDragging && "opacity-50 scale-95 z-50"
        )}
        style={{ borderLeftColor: scene.color }}
      >
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={scene.thumbnail} 
            alt={scene.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div 
            style={{ backgroundColor: scene.color }}
            className="absolute top-2 left-2 px-2 py-0.5 bg-opacity-80 backdrop-blur-md rounded text-[10px] text-white font-bold shadow-lg"
          >
            {scene.id.toUpperCase()}
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] text-white/90">
            {scene.duration}s
          </div>
        </div>
        <div className="p-3 space-y-2">
          <h3 className={cn("text-xs font-bold truncate", isDarkMode ? "text-white" : "text-zinc-900")}>{scene.title}</h3>
          <div className="flex justify-between items-center">
            <div className="flex -space-x-1">
              {[1, 2].map((i) => (
                <div key={i} className={cn(
                  "w-4 h-4 rounded-full border overflow-hidden",
                  isDarkMode ? "border-zinc-900" : "border-white"
                )}>
                  <img src={`https://picsum.photos/seed/${scene.id}-${i}/20/20`} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className={cn("text-[10px] font-bold", isDarkMode ? "text-green-400" : "text-green-600")}>${scene.cost}</span>
          </div>
          <div className="pt-1">
            <CompactSceneProgress 
              scene={scene} 
              onUpdate={onUpdate} 
              isDarkMode={isDarkMode} 
            />
          </div>
        </div>

        {isEditMode && (
          <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div 
              {...dragHandleProps}
              className={cn(
                "p-1 rounded cursor-grab active:cursor-grabbing",
                isDarkMode ? "bg-zinc-800 text-white/60" : "bg-white text-zinc-600 shadow-sm"
              )}
            >
              <GripVertical size={12} />
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={scene.id}
      onClick={isEditMode ? undefined : onClick}
      whileHover={isEditMode ? {} : { 
        y: -4,
        boxShadow: isDarkMode ? "0 0 20px rgba(255, 255, 255, 0.08)" : "0 10px 30px rgba(0, 0, 0, 0.1)",
        borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
      }}
      className={cn(
        "border rounded-xl overflow-hidden group transition-all duration-300 relative",
        isEditMode ? "cursor-default" : "cursor-pointer",
        isDarkMode ? "bg-zinc-900/50 border-white/5" : "bg-white border-zinc-200 shadow-sm",
        isEditMode && (isDarkMode ? "border-white/20 border-2" : "border-zinc-400 border-2"),
        isDragging && "opacity-50 scale-95 z-50"
      )}
    >
    {isEditMode && (
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <button 
          onClick={(e) => { e.stopPropagation(); onDuplicate?.(); }}
          className={cn(
            "p-1.5 rounded-lg transition-all",
            isDarkMode ? "bg-zinc-800/80 text-white/60 hover:text-white hover:bg-zinc-700" : "bg-white/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 shadow-sm"
          )}
        >
          <Copy size={14} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          className={cn(
            "p-1.5 rounded-lg transition-all",
            isDarkMode ? "bg-red-500/20 text-red-400 hover:bg-red-500/40" : "bg-red-50 text-red-600 hover:bg-red-100 shadow-sm"
          )}
        >
          <Trash2 size={14} />
        </button>
      </div>
    )}

    {isEditMode && (
      <div 
        {...dragHandleProps}
        className={cn(
          "absolute top-2 left-2 z-10 p-1.5 rounded-lg cursor-grab active:cursor-grabbing transition-all",
          isDarkMode ? "bg-zinc-800/80 text-white/60 hover:text-white hover:bg-zinc-700" : "bg-white/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 shadow-sm"
        )}
      >
        <GripVertical size={14} />
      </div>
    )}

    <div className="relative aspect-video overflow-hidden">
      <img 
        src={scene.thumbnail} 
        alt={scene.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute bottom-2 left-2 flex items-center gap-1">
        {isEditMode ? (
          <div className="flex items-center bg-black/80 backdrop-blur-md rounded px-1.5 py-0.5">
            <input 
              type="number"
              className="w-8 bg-transparent text-[10px] text-white outline-none text-center"
              value={scene.duration}
              onChange={(e) => onUpdate({ ...scene, duration: parseInt(e.target.value) || 0 }, scene.id)}
            />
            <span className="text-[10px] text-white/60">s</span>
          </div>
        ) : (
          <div className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] text-white/90">
            {scene.duration}s
          </div>
        )}
      </div>
      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] text-white/90">
        {scene.version}
      </div>
    </div>
    <div className="p-4 space-y-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            {isEditMode ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <input 
                    className={cn(
                      "text-[10px] font-bold uppercase w-12 bg-transparent border-b outline-none",
                      isDarkMode ? "text-white border-white/20 focus:border-white" : "text-zinc-900 border-zinc-200 focus:border-zinc-900"
                    )}
                    style={{ color: scene.color }}
                    value={scene.id}
                    onChange={(e) => onUpdate({ ...scene, id: e.target.value }, scene.id)}
                  />
                  <input 
                    className={cn(
                      "text-sm font-semibold bg-transparent border-b outline-none flex-1",
                      isDarkMode ? "text-white border-white/20 focus:border-white" : "text-zinc-900 border-zinc-200 focus:border-zinc-900"
                    )}
                    value={scene.title}
                    onChange={(e) => onUpdate({ ...scene, title: e.target.value }, scene.id)}
                  />
                </div>
              </div>
            ) : (
              <h3 className={cn("text-sm font-semibold truncate", isDarkMode ? "text-white" : "text-zinc-900")}>
                <span style={{ color: scene.color }} className="mr-2">{scene.id.toUpperCase()}</span>
                {scene.title}
              </h3>
            )}
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn(
                "w-5 h-5 rounded-full border-2 overflow-hidden transition-colors",
                isDarkMode ? "border-zinc-900" : "border-white"
              )}>
                <img src={`https://picsum.photos/seed/${scene.id}-${i}/20/20`} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        {isEditMode ? (
          <textarea 
            className={cn(
              "text-[10px] w-full bg-transparent border rounded-lg p-2 outline-none resize-none h-16 leading-relaxed",
              isDarkMode ? "text-white/60 border-white/10 focus:border-white/30" : "text-zinc-500 border-zinc-200 focus:border-zinc-400"
            )}
            value={scene.description}
            onChange={(e) => onUpdate({ ...scene, description: e.target.value }, scene.id)}
          />
        ) : (
          <p className={cn("text-[10px] line-clamp-2 leading-relaxed", isDarkMode ? "text-white/40" : "text-zinc-500")}>
            {scene.description}
          </p>
        )}
      </div>
      
      <CompactSceneProgress 
        scene={scene} 
        onUpdate={onUpdate} 
        isDarkMode={isDarkMode} 
      />

      {/* Footer: Color Picker & Budget */}
        <div className="flex justify-between items-center pt-1">
          <label 
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "p-1.5 rounded-lg transition-colors cursor-pointer",
              isDarkMode ? "hover:bg-white/10 text-white/40 hover:text-white" : "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
            )}
          >
            <input 
              type="color" 
              className="sr-only"
              value={scene.color}
              onChange={(e) => onUpdate({ ...scene, color: e.target.value }, scene.id)}
            />
            <Palette size={14} />
          </label>

          <div className={cn(
            "px-3 py-1 border rounded-lg flex items-center gap-1 transition-all",
            isDarkMode ? "border-green-500/30 bg-green-500/10" : "border-green-200 bg-green-50"
          )}>
            <span className={cn("text-[10px] font-bold", isDarkMode ? "text-green-400" : "text-green-600")}>${scene.cost}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SortableStoryboardCard = (props: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(props.viewMode === 'timeline' && "flex-shrink-0")}>
      <StoryboardCard 
        {...props} 
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
};

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isDarkMode 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void, 
  title: string, 
  message: string,
  isDarkMode: boolean 
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={cn(
            "relative w-full max-w-md p-6 rounded-2xl border shadow-2xl",
            isDarkMode ? "bg-zinc-900 border-white/10" : "bg-white border-zinc-200"
          )}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className={cn("text-lg font-bold", isDarkMode ? "text-white" : "text-zinc-900")}>{title}</h3>
              <p className={cn("text-sm", isDarkMode ? "text-white/60" : "text-zinc-500")}>{message}</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                isDarkMode ? "bg-white/5 text-white hover:bg-white/10" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              )}
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
            >
              Delete Scene
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const SceneSection = ({ scene, isEditing, setIsEditing, isDarkMode, onUpdate }: { 
  scene: Scene, 
  isEditing: boolean, 
  setIsEditing: (v: boolean) => void,
  isDarkMode: boolean,
  onUpdate: (u: Scene, id: string) => void
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const addAsset = (status: 'purchase' | 'create' | 'existing') => {
    const newAsset: Scene['assets'][0] = { 
      name: 'New Asset', 
      type: 'model', 
      cost: 0, 
      status: status 
    };
    onUpdate({ ...scene, assets: [...scene.assets, newAsset] }, scene.id);
    setIsEditing(true);
    setIsOpen(true);
  };

  return (
    <div className={cn(
      "border-t transition-all",
      isDarkMode ? "border-white/5" : "border-zinc-100"
    )}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-8 py-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer",
          isDarkMode ? "text-white/30 hover:text-white/50" : "text-zinc-400 hover:text-zinc-600"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Asset Inventory & Cost Breakdown</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
              }}
              className={cn(
                "p-1.5 rounded-md transition-all shadow-sm",
                isEditing 
                  ? "bg-blue-500 text-white shadow-blue-500/20" 
                  : (isDarkMode ? "hover:bg-white/10 text-white/40 hover:text-white" : "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600")
              )}
            >
              <Edit2 size={12} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-0.5 rounded-full transition-colors", 
              scene.assets.length === 0 
                ? (isDarkMode ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-500")
                : (isDarkMode ? "bg-white/5 text-white/50" : "bg-zinc-100 text-zinc-500")
            )}>
              {scene.assets.length === 0 ? "Zero Assets" : `${scene.assets.length} Assets`}
            </span>
          </div>
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={cn(
              "p-8 pt-0 grid grid-cols-1 md:grid-cols-3 gap-8",
              isDarkMode ? "bg-black/10" : "bg-zinc-50/10"
            )}>
              {/* To Purchase */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-red-500/10 pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-500/60">New Purchases</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addAsset('purchase');
                    }}
                    className="p-1 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={10} strokeWidth={3} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {scene.assets.filter(a => a.status === 'purchase').map((asset, idx) => (
                    <AssetCard key={`purchase-${idx}`} asset={asset} isEditing={isEditing} setIsEditing={setIsEditing} isDarkMode={isDarkMode} scene={scene} onUpdate={onUpdate} borderColor="border-red-500/20" />
                  ))}
                </div>
              </div>

              {/* To Create */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-blue-500/10 pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500/60">Asset Creation</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addAsset('create');
                    }}
                    className="p-1 rounded-md bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={10} strokeWidth={3} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {scene.assets.filter(a => a.status === 'create').map((asset, idx) => (
                    <AssetCard key={`create-${idx}`} asset={asset} isEditing={isEditing} setIsEditing={setIsEditing} isDarkMode={isDarkMode} scene={scene} onUpdate={onUpdate} borderColor="border-blue-500/20" />
                  ))}
                </div>
              </div>

              {/* Existing */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-green-500/10 pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-500/60">Project Inventory</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addAsset('existing');
                    }}
                    className="p-1 rounded-md bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={10} strokeWidth={3} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {scene.assets.filter(a => a.status === 'existing').map((asset, idx) => (
                    <AssetCard key={`existing-${idx}`} asset={asset} isEditing={isEditing} setIsEditing={setIsEditing} isDarkMode={isDarkMode} scene={scene} onUpdate={onUpdate} borderColor="border-green-500/20" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BudgetTab = ({ scenes, onUpdate, isDarkMode }: { scenes: Scene[], onUpdate: (updated: Scene, originalId: string) => void, isDarkMode: boolean }) => {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [isAssetsOpen, setIsAssetsOpen] = React.useState(false);
  
  const totalCost = scenes.reduce((acc, s) => acc + s.cost, 0);
  
  const allAssets = scenes.flatMap(s => s.assets.map(a => ({ ...a, sceneId: s.id })));
  const totalPurchase = allAssets.filter(a => a.status === 'purchase').reduce((acc, a) => acc + (a.cost || 0), 0);
  const totalCreate = allAssets.filter(a => a.status === 'create').reduce((acc, a) => acc + (a.cost || 0), 0);
  const totalExisting = allAssets.filter(a => a.status === 'existing').reduce((acc, a) => acc + (a.cost || 0), 0);

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-start">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-12">
            <div>
              <h2 className={cn("text-xs font-semibold uppercase tracking-widest mb-1", isDarkMode ? "text-white/50" : "text-zinc-400")}>Total Budget</h2>
              <p className={cn("text-5xl font-bold font-sans tracking-tighter", isDarkMode ? "text-white" : "text-zinc-900")}>${totalCost.toLocaleString()}</p>
            </div>
            
            <button 
              onClick={() => setIsAssetsOpen(!isAssetsOpen)}
              className={cn(
                "group flex flex-col gap-1 p-4 rounded-3xl border transition-all h-[76px] justify-center min-w-[200px]",
                isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-white/30" : "text-zinc-400")}>Global Assets</span>
                {isAssetsOpen ? <ChevronUp size={12} className="opacity-40" /> : <ChevronDown size={12} className="opacity-40" />}
              </div>
              <p className={cn("text-xl font-bold font-sans", isDarkMode ? "text-white/80" : "text-zinc-800")}>{allAssets.length} <span className="text-xs font-normal opacity-50">Items</span></p>
            </button>
          </div>

          <AnimatePresence>
            {isAssetsOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className={cn(
                  "p-6 rounded-2xl border-2 grid grid-cols-1 md:grid-cols-3 gap-6",
                  isDarkMode ? "bg-black/20 border-white/5" : "bg-zinc-50 border-zinc-200"
                )}>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-500/60">To Purchase</p>
                    <p className={cn("text-2xl font-bold font-sans", isDarkMode ? "text-white" : "text-zinc-900")}>${totalPurchase.toLocaleString()}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {allAssets.filter(a => a.status === 'purchase').map((a, i) => (
                        <div key={i} className={cn("px-2.5 py-0.5 rounded-full text-[11px] border font-bold flex items-center gap-1.5 transition-all hover:bg-red-500/20", isDarkMode ? "bg-red-500/10 border-red-500/40 text-red-100" : "bg-red-50 border-red-200 text-red-700")}>
                          {a.name}
                          <span className="opacity-40 font-normal">${(a.cost || 0).toLocaleString()}</span>
                          {a.sourceUrl && (
                            <button onClick={() => window.open(a.sourceUrl, '_blank')} className="hover:text-white transition-colors">
                              <Link size={8} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={cn("space-y-4 border-x px-8", isDarkMode ? "border-white/5" : "border-zinc-200")}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500/60">Asset Creation</p>
                    <p className={cn("text-2xl font-bold font-sans", isDarkMode ? "text-white" : "text-zinc-900")}>${totalCreate.toLocaleString()}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {allAssets.filter(a => a.status === 'create').map((a, i) => (
                        <div key={i} className={cn("px-2.5 py-0.5 rounded-full text-[11px] border font-bold flex items-center gap-1.5 transition-all hover:bg-blue-500/20", isDarkMode ? "bg-blue-500/10 border-blue-500/40 text-blue-100" : "bg-blue-50 border-blue-200 text-blue-700")}>
                          {a.name}
                          <span className="opacity-40 font-normal">${(a.cost || 0).toLocaleString()}</span>
                          {a.sourceUrl && (
                            <button onClick={() => window.open(a.sourceUrl, '_blank')} className="hover:text-white transition-colors">
                              <Link size={8} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-500/60">Project Inventory</p>
                    <p className={cn("text-2xl font-bold font-sans", isDarkMode ? "text-white" : "text-zinc-900")}>${totalExisting.toLocaleString()}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {allAssets.filter(a => a.status === 'existing').map((a, i) => (
                        <div key={i} className={cn("px-2.5 py-0.5 rounded-full text-[11px] border font-bold flex items-center gap-1.5 transition-all hover:bg-green-500/20", isDarkMode ? "bg-green-500/10 border-green-500/40 text-green-100" : "bg-green-50 border-green-200 text-green-700")}>
                          {a.name}
                          <span className="opacity-40 font-normal">${(a.cost || 0).toLocaleString()}</span>
                          {a.sourceUrl && (
                            <button onClick={() => window.open(a.sourceUrl, '_blank')} className="hover:text-white transition-colors">
                              <Link size={8} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all",
              isEditing 
                ? "bg-blue-500 text-white shadow-xl shadow-blue-500/20" 
                : (isDarkMode ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-zinc-900 text-white hover:bg-zinc-800")
            )}
          >
            {isEditing ? <><Check size={16} /> Finish Editing</> : <><Edit2 size={16} /> Edit Budget</>}
          </button>
        </div>
      </div>

      <div className="space-y-8 pb-20">
        {scenes.map((scene) => (
          <div 
            key={scene.id}
            className={cn(
              "flex flex-col rounded-2xl border border-l-4 transition-all overflow-hidden",
              isDarkMode ? "bg-zinc-900/40 border-white/5" : "bg-white border-zinc-200 shadow-sm"
            )}
            style={{ borderLeftColor: scene.color }}
          >
            <div className="flex gap-10 p-8 items-start">
              {/* Thumbnail & Title */}
              <div className="flex-shrink-0 space-y-4 w-48">
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl relative group w-full aspect-video">
                  <img src={scene.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-col gap-1">
                    <p 
                      className="text-[11px] font-black uppercase tracking-widest opacity-60"
                      style={{ color: scene.color }}
                    >
                      {scene.id}
                    </p>
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <input 
                          type="text"
                          value={scene.title}
                          onChange={(e) => onUpdate({ ...scene, title: e.target.value }, scene.id)}
                          className={cn(
                            "w-full bg-blue-500/5 border-b border-blue-500/50 text-base font-bold focus:outline-none px-1 rounded-t",
                            isDarkMode ? "text-white" : "text-zinc-900"
                          )}
                        />
                      ) : (
                        <h3 className={cn("text-base font-bold truncate", isDarkMode ? "text-white" : "text-zinc-900")}>{scene.title}</h3>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Description Section */}
                <div className="space-y-3">
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider border-b pb-1.5 mb-2", isDarkMode ? "text-white/20 border-white/10" : "text-zinc-400 border-zinc-100")}>Description</p>
                  {isEditing ? (
                    <textarea 
                      value={scene.description}
                      onChange={(e) => onUpdate({ ...scene, description: e.target.value }, scene.id)}
                      className={cn(
                        "w-full bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 text-sm focus:outline-none resize-none h-32 leading-relaxed transition-all focus:bg-blue-500/10",
                        isDarkMode ? "text-white/60" : "text-zinc-600"
                      )}
                    />
                  ) : (
                    <p className={cn(
                      "text-sm transition-colors leading-relaxed line-clamp-4",
                      isDarkMode ? "text-white/40" : "text-zinc-500"
                    )}>
                      {scene.description}
                    </p>
                  )}
                </div>

                {/* Audio Section */}
                <div className="space-y-3 border-l-2 pl-10 transition-all" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider border-b pb-1.5 mb-2", isDarkMode ? "text-white/20 border-white/10" : "text-zinc-400 border-zinc-100")}>Audio</p>
                  <div className="space-y-2">
                    <p className={cn("text-sm font-bold font-sans", isDarkMode ? "text-white/70" : "text-zinc-800")}>{scene.audio.title}</p>
                    {isEditing ? (
                      <textarea 
                        value={scene.audio.description || ''}
                        onChange={(e) => onUpdate({ ...scene, audio: { ...scene.audio, description: e.target.value } }, scene.id)}
                        placeholder="Describe the audio landscape..."
                        className={cn(
                          "w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-sm focus:outline-none resize-none h-24 leading-relaxed transition-all focus:bg-emerald-500/10",
                          isDarkMode ? "text-white/60" : "text-zinc-600"
                        )}
                      />
                    ) : (
                      <p className={cn(
                        "text-sm leading-relaxed line-clamp-3",
                        isDarkMode ? "text-white/30" : "text-zinc-400"
                      )}>
                        {scene.audio.description || "Subtle atmospheric sound design tailored for high-quality product visualization."}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Budget Total */}
              <div className="text-right min-w-[160px] flex-shrink-0 pt-2">
                {isEditing ? (
                   <div className="flex flex-col items-end gap-1">
                     <p className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-white/20" : "text-zinc-400")}>Manual Override</p>
                     <div className="flex items-center gap-1">
                       <span className="text-xl font-bold text-green-500 font-sans">$</span>
                       <input 
                         type="number"
                         value={scene.cost}
                         onChange={(e) => onUpdate({ ...scene, cost: parseInt(e.target.value) || 0 }, scene.id)}
                         className={cn(
                           "bg-green-500/5 border-b border-green-500/50 text-3xl font-bold font-sans w-32 text-right focus:outline-none px-1",
                           isDarkMode ? "text-green-400" : "text-green-600"
                         )}
                       />
                     </div>
                   </div>
                ) : (
                  <>
                    <p className={cn(
                      "text-4xl font-bold font-sans tracking-tight mb-1",
                      isDarkMode ? "text-green-400" : "text-green-600"
                    )}>
                      ${scene.cost.toLocaleString()}
                    </p>
                    <p className={cn("text-[11px] font-bold uppercase tracking-widest opacity-40", isDarkMode ? "text-white" : "text-zinc-900")}>Scene Allocation</p>
                  </>
                )}
              </div>
            </div>

            {/* Assets Footer Section - Collapsible Dropdown */}
            <SceneSection scene={scene} isEditing={isEditing} setIsEditing={setIsEditing} isDarkMode={isDarkMode} onUpdate={onUpdate} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface AssetCardProps {
  key?: React.Key;
  asset: Scene['assets'][0];
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  isDarkMode: boolean;
  scene: Scene;
  onUpdate: (u: Scene, id: string) => void;
  borderColor: string;
}

const AssetCard = ({ asset, isEditing, setIsEditing, isDarkMode, scene, onUpdate, borderColor }: AssetCardProps) => {
  const assetIdx = scene.assets.findIndex(a => a === asset);
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-full border transition-all group",
      isDarkMode ? "bg-zinc-900/50" : "bg-white",
      borderColor
    )}>
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow-inner flex-shrink-0",
        isDarkMode ? "bg-white/5 text-white/40" : "bg-zinc-100 text-zinc-500"
      )}>
        {asset.type === 'model' && <Box size={14} />}
        {asset.type === 'texture' && <ImageIcon size={14} />}
        {asset.type === 'sim' && <Wind size={14} />}
        {asset.type === 'other' && <Layers size={14} />}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {isEditing ? (
            <input 
              type="text"
              autoFocus={asset.name === 'New Asset'}
              value={asset.name}
              onChange={(e) => {
                const newAssets = [...scene.assets];
                newAssets[assetIdx] = { ...asset, name: e.target.value };
                onUpdate({ ...scene, assets: newAssets }, scene.id);
              }}
              className={cn(
                "text-sm font-bold leading-tight bg-blue-500/5 border-b border-blue-500/30 focus:outline-none flex-1 min-w-0",
                isDarkMode ? "text-white/80" : "text-zinc-800"
              )}
            />
          ) : (
            <span className={cn("text-sm font-bold leading-tight truncate", isDarkMode ? "text-white/70" : "text-zinc-800")}>{asset.name}</span>
          )}
          
          <div className="flex items-center gap-1">
            {isEditing && (
              <>
                <button 
                  className={cn(
                    "p-1 rounded-md transition-all shadow-sm",
                    isDarkMode ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/30" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  )}
                  onClick={() => setIsEditing(false)}
                >
                  <Check size={12} strokeWidth={3} />
                </button>
                <button 
                  className={cn(
                    "p-1 rounded-md transition-all shadow-sm",
                    isDarkMode ? "bg-red-500/10 text-red-400 hover:bg-red-500/30" : "bg-red-50 text-red-600 hover:bg-red-100"
                  )}
                  onClick={() => {
                    const newAssets = scene.assets.filter((_, i) => i !== assetIdx);
                    onUpdate({ ...scene, assets: newAssets }, scene.id);
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </>
            )}
            
            {(asset.sourceUrl && !isEditing) && (
              <button 
                className={cn(
                  "p-1 rounded-md transition-all opacity-0 group-hover:opacity-100",
                  isDarkMode ? "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white" : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600"
                )}
                onClick={() => window.open(asset.sourceUrl, '_blank')}
              >
                <Link size={10} />
              </button>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex items-center gap-1 group mt-0.5">
            <span className="text-xs font-bold text-green-500 opacity-60">$</span>
            <input 
              type="number"
              value={asset.cost || 0}
              onChange={(e) => {
                const newVal = parseInt(e.target.value) || 0;
                const newAssets = [...scene.assets];
                newAssets[assetIdx] = { ...asset, cost: newVal };
                const newTotal = newAssets.reduce((acc, a) => acc + (a.cost || 0), 0);
                onUpdate({ ...scene, assets: newAssets, cost: newTotal }, scene.id);
              }}
              className={cn(
                "bg-transparent border-b border-blue-500/30 font-sans font-bold text-base focus:outline-none w-full text-green-500",
              )}
            />
          </div>
        ) : (
          <span className={cn("text-base font-sans font-bold", isDarkMode ? "text-green-400" : "text-green-600")}>
            ${(asset.cost || 0).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

const ScheduleTab = ({ scenes, onUpdate, isDarkMode }: { scenes: Scene[], onUpdate: (updated: Scene, originalId: string) => void, isDarkMode: boolean }) => {
  const [currentDay, setCurrentDay] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [viewWindow] = React.useState(14); // 14 days visible
  const timelineRef = React.useRef<HTMLDivElement>(null);

  const days = Array.from({ length: 30 }, (_, i) => i); // 30 days total project
  const DAY_WIDTH = 64; // px (w-16)
  const DEADLINE_DAY = 21; // Day 22 (0-indexed is 21)

  const STAGES = [
    { id: 'stage3D', label: '3D Scene', color: 'bg-blue-500' },
    { id: 'lighting', label: 'Lighting', color: 'bg-orange-500' },
    { id: 'rendering', label: 'Rendering', color: 'bg-emerald-500' },
    { id: 'compositing', label: 'Compositing', color: 'bg-purple-500' },
  ] as const;

  const handleMove = (dir: 'prev' | 'next') => {
    if (dir === 'prev') setCurrentDay(Math.max(0, currentDay - 1));
    else setCurrentDay(Math.min(days.length - viewWindow, currentDay + 1));
  };

  const updateSchedule = (sceneId: string, stageId: string, type: 'start' | 'duration', value: number) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene || !scene.schedule) return;
    
    const newSchedule = {
      ...scene.schedule,
      [stageId]: {
        ...(scene.schedule as any)[stageId],
        [type]: Math.max(0, value)
      }
    };
    
    onUpdate({ ...scene, schedule: newSchedule }, scene.id);
  };

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-shrink-0">
        <div className="flex items-center gap-8">
          <div>
            <h2 className={cn("text-2xl font-bold", isDarkMode ? "text-white" : "text-zinc-900")}>Production Schedule</h2>
            <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-1", isDarkMode ? "text-white/30" : "text-zinc-400")}>Timeline Overview</p>
          </div>

          {/* Project Stats */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "px-4 py-2 rounded-xl border flex flex-col items-center min-w-[100px]",
              isDarkMode ? "bg-zinc-900/50 border-white/5" : "bg-white border-zinc-200 shadow-sm"
            )}>
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-blue-400" : "text-blue-600")}>30 Days</span>
              <span className={cn("text-[8px] font-medium uppercase tracking-widest opacity-40", isDarkMode ? "text-white" : "text-zinc-900")}>Total Duration</span>
            </div>
            <div className={cn(
              "px-4 py-2 rounded-xl border flex flex-col items-center min-w-[100px]",
              isDarkMode ? "bg-zinc-900/50 border-white/5" : "bg-white border-zinc-200 shadow-sm"
            )}>
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-emerald-400" : "text-emerald-600")}>{DEADLINE_DAY + 1} Days</span>
              <span className={cn("text-[8px] font-medium uppercase tracking-widest opacity-40", isDarkMode ? "text-white" : "text-zinc-900")}>To Deadline</span>
            </div>
            <div className={cn(
              "px-4 py-2 rounded-xl border flex flex-col items-center min-w-[100px]",
              isDarkMode ? "bg-zinc-900/50 border-white/5" : "bg-white border-zinc-200 shadow-sm"
            )}>
              <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-red-400" : "text-red-600")}>3/22</span>
              <span className={cn("text-[8px] font-medium uppercase tracking-widest opacity-40", isDarkMode ? "text-white" : "text-zinc-900")}>Deadline Date</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "flex p-1 border rounded-xl transition-colors",
            isDarkMode ? "bg-zinc-900 border-white/5" : "bg-white border-zinc-200 shadow-sm"
          )}>
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              {isExpanded ? 'Compact' : 'Expanded'}
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className={cn(
             "flex-1 overflow-auto no-scrollbar border rounded-2xl transition-colors relative",
             isDarkMode ? "bg-zinc-900/20 border-white/5" : "bg-white border-zinc-200 shadow-inner"
           )}>
        <div className="min-w-fit flex flex-col p-6">
          {/* Repositioned Scroller */}
          <div className="flex mb-8 sticky top-0 z-30">
            <div className="w-64 flex-shrink-0" />
            <div className="flex-1 px-4">
              <div className={cn(
                "w-full h-4 rounded-full relative overflow-hidden transition-colors border",
                isDarkMode ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200 shadow-inner"
              )}>
                <input 
                  type="range"
                  min={0}
                  max={days.length - viewWindow}
                  value={currentDay}
                  onChange={(e) => setCurrentDay(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className="h-full bg-blue-500/80 rounded-full transition-all duration-200 pointer-events-none flex items-center justify-center"
                  style={{ 
                    width: `${(viewWindow / days.length) * 100}%`,
                    marginLeft: `${(currentDay / days.length) * 100}%`,
                  }}
                >
                  <div className="w-8 h-1 bg-white/40 rounded-full" />
                </div>
              </div>
              <div className="flex justify-between mt-2 px-1">
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-30">Day 1</span>
                <span className={cn("text-[9px] font-black uppercase tracking-widest", isDarkMode ? "text-blue-400" : "text-blue-600")}>
                  Viewing: Day {currentDay + 1} — {currentDay + viewWindow}
                </span>
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-30">Day 30</span>
              </div>
            </div>
          </div>

          {/* Days Header */}
          <div className="flex mb-6 sticky top-0 z-20">
            <div className="w-64 flex-shrink-0" />
            <div className="flex relative">
              {days.slice(currentDay, currentDay + viewWindow).map(day => (
                <div key={day} className="w-16 flex-shrink-0 flex flex-col items-center">
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", isDarkMode ? "text-white/20" : "text-zinc-300")}>
                    3/{day + 1}
                  </span>
                  <div className={cn("w-[2px] h-2 rounded-full", isDarkMode ? "bg-white/20" : "bg-zinc-300")} />
                </div>
              ))}
              
              {/* Deadline Marker Header */}
              {DEADLINE_DAY >= currentDay && DEADLINE_DAY < currentDay + viewWindow && (
                <div 
                  className="absolute top-0 w-[2px] h-full bg-red-500 z-30"
                  style={{ left: `${(DEADLINE_DAY - currentDay) * DAY_WIDTH + DAY_WIDTH/2}px` }}
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-[8px] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                    Deadline (3/22)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scenes Timeline */}
          <div className="space-y-0">
            {scenes.map(scene => (
              <div key={scene.id} className={cn(
                "flex items-center group transition-all duration-500 border-b",
                isDarkMode ? "border-white/5" : "border-zinc-100",
                isExpanded ? "h-48" : "h-20"
              )}>
                {/* Scene Info */}
                <div className="w-64 flex-shrink-0 flex items-center gap-4 pr-8 sticky left-0 z-10">
                  <div className={cn(
                    "rounded-2xl overflow-hidden flex-shrink-0 border transition-all duration-500",
                    isDarkMode ? "border-white/10" : "border-zinc-200 shadow-sm",
                    isExpanded ? "w-20 h-20" : "w-10 h-10"
                  )}>
                    <img src={scene.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-tight mb-0.5" style={{ color: scene.color }}>{scene.id}</p>
                    <h3 className={cn("text-sm font-bold truncate", isDarkMode ? "text-white" : "text-zinc-900")}>{scene.title}</h3>
                  </div>
                </div>

                {/* Timeline Tracks */}
                <div className={cn(
                  "relative flex-1 h-full flex flex-col justify-center",
                  isExpanded ? "gap-3" : "gap-1"
                )}>
                  {/* Background Grid Lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {days.slice(currentDay, currentDay + viewWindow).map(day => (
                      <div key={day} className={cn("w-16 h-full flex-shrink-0 border-r-[2px]", isDarkMode ? "border-white/5" : "border-zinc-100")} />
                    ))}
                    
                    {/* Deadline Marker Body */}
                    {DEADLINE_DAY >= currentDay && DEADLINE_DAY < currentDay + viewWindow && (
                      <div 
                        className="absolute top-0 w-[2px] h-full bg-red-500/20 z-0"
                        style={{ left: `${(DEADLINE_DAY - currentDay) * DAY_WIDTH + DAY_WIDTH/2}px` }}
                      >
                        <div className="w-full h-full border-l-[2px] border-red-500/40 border-dashed" />
                      </div>
                    )}
                  </div>

                  {STAGES.map(stage => {
                    const sched = scene.schedule?.[stage.id];
                    if (!sched) return null;
                    
                    const startOffset = sched.start - currentDay;
                    const width = sched.duration;
                    
                    // Only render if visible in current window
                    if (startOffset + width < 0 || startOffset > viewWindow) return null;

                    const left = Math.max(0, startOffset) * 4;
                    const barWidth = Math.min(viewWindow - Math.max(0, startOffset), width + Math.min(0, startOffset)) * 4;

                    return (
                      <motion.div
                        key={stage.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        drag="x"
                        dragMomentum={false}
                        dragElastic={0}
                        onDragEnd={(_, info) => {
                          const deltaDays = Math.round(info.offset.x / DAY_WIDTH);
                          if (deltaDays !== 0) {
                            updateSchedule(scene.id, stage.id, 'start', sched.start + deltaDays);
                          }
                        }}
                        className={cn(
                          "rounded-lg relative group/bar transition-all duration-300 shadow-lg flex items-center justify-between px-3 cursor-grab active:cursor-grabbing overflow-hidden",
                          isExpanded ? "h-7" : "h-3",
                          stage.color
                        )}
                        style={{
                          marginLeft: `${left}rem`,
                          width: `${barWidth}rem`,
                        }}
                      >
                        {/* Glow Effect */}
                        <div className={cn("absolute inset-0 rounded-lg blur-md opacity-0 group-hover/bar:opacity-40 transition-opacity", stage.color)} />
                        
                        {/* Resize Handle Left */}
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20 z-20 flex items-center justify-center"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            const startX = e.clientX;
                            const startDur = sched.duration;
                            const startPos = sched.start;
                            const onMouseMove = (moveEvent: MouseEvent) => {
                              const delta = Math.round((moveEvent.clientX - startX) / DAY_WIDTH);
                              if (delta !== 0) {
                                updateSchedule(scene.id, stage.id, 'start', startPos + delta);
                                updateSchedule(scene.id, stage.id, 'duration', startDur - delta);
                              }
                            };
                            const onMouseUp = () => {
                              window.removeEventListener('mousemove', onMouseMove);
                              window.removeEventListener('mouseup', onMouseUp);
                            };
                            window.addEventListener('mousemove', onMouseMove);
                            window.addEventListener('mouseup', onMouseUp);
                          }}
                        >
                          <div className="w-1 h-3 bg-white/40 rounded-full" />
                        </div>

                        {/* Label Inside */}
                        {isExpanded && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-white truncate z-10 drop-shadow-sm">
                            {stage.label}
                          </span>
                        )}

                        {/* Resize Handle Right */}
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20 z-20 flex items-center justify-center"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            const startX = e.clientX;
                            const startDur = sched.duration;
                            const onMouseMove = (moveEvent: MouseEvent) => {
                              const delta = Math.round((moveEvent.clientX - startX) / DAY_WIDTH);
                              if (delta !== 0) {
                                updateSchedule(scene.id, stage.id, 'duration', startDur + delta);
                              }
                            };
                            const onMouseUp = () => {
                              window.removeEventListener('mousemove', onMouseMove);
                              window.removeEventListener('mouseup', onMouseUp);
                            };
                            window.addEventListener('mousemove', onMouseMove);
                            window.addEventListener('mouseup', onMouseUp);
                          }}
                        >
                          <div className="w-1 h-3 bg-white/40 rounded-full" />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all scale-90 group-hover/bar:scale-100 bg-zinc-900 text-[9px] font-bold uppercase tracking-widest text-white px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none z-50 shadow-xl border border-white/10">
                          {sched.duration} Days (3/{sched.start + 1} - 3/{sched.start + sched.duration})
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReferencesTab = ({ scenes, onUpdate, isDarkMode }: { scenes: Scene[], onUpdate: (updated: Scene, originalId: string) => void, isDarkMode: boolean }) => (
  <div className="p-8 space-y-12 h-full overflow-y-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {scenes.map((scene) => (
        <div key={scene.id} className={cn(
          "border rounded-2xl p-6 space-y-4 transition-colors relative overflow-hidden",
          isDarkMode ? "bg-zinc-900/40 border-white/5" : "bg-white border-zinc-200 shadow-sm"
        )}>
          {/* Color Code Strip */}
          <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: scene.color }} />

          <div className="flex items-center justify-between">
            <h3 className={cn("text-sm font-bold", isDarkMode ? "text-white" : "text-zinc-900")}>
              <span className="mr-2" style={{ color: scene.color }}>{scene.id.toUpperCase()}</span>
              {scene.title}
            </h3>
            {/* Thumbnail change disabled in demo */}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className={cn("text-[10px] uppercase tracking-widest font-bold", isDarkMode ? "text-white/40" : "text-zinc-400")}>Ref Images</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {scene.references.images.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-white/10 aspect-video">
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className={cn("text-[10px] uppercase tracking-widest font-bold", isDarkMode ? "text-white/40" : "text-zinc-400")}>3D Assets</p>
            <div className={cn(
              "flex items-center gap-2 p-2 rounded-xl text-[10px] cursor-default",
              isDarkMode ? "bg-white/5 text-white/40" : "bg-zinc-50 text-zinc-400 border border-zinc-100"
            )}>
              <FolderOpen size={12} />
              {scene.references.modelLink.split('/').pop()}
            </div>
          </div>

          <div className="space-y-2">
            <p className={cn("text-[10px] uppercase tracking-widest font-bold", isDarkMode ? "text-white/40" : "text-zinc-400")}>Audio</p>
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-2xl transition-colors",
              isDarkMode ? "bg-zinc-900" : "bg-zinc-50 border border-zinc-100"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isDarkMode ? "bg-white/5 text-white/60" : "bg-white text-zinc-400 shadow-sm"
              )}>
                <Music size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-[10px] font-medium truncate", isDarkMode ? "text-white" : "text-zinc-900")}>{scene.audio.title}</p>
                <p className={cn("text-[8px] truncate", isDarkMode ? "text-white/40" : "text-zinc-500")}>{scene.audio.file}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const NodeEditor = ({ scene, onUpdateNodes, isDarkMode }: { scene: Scene, onUpdateNodes: (nodes: EditorNode[]) => void, isDarkMode: boolean }) => {
  const nodes = scene.nodeEditorData?.nodes || [];
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [activeTool, setActiveTool] = React.useState<'pointer' | 'shape' | 'text' | 'note' | 'image' | 'arrow' | 'line'>('pointer');
  const [shapeType, setShapeType] = React.useState<'square' | 'circle' | 'triangle' | null>(null);
  const [dragStart, setDragStart] = React.useState<{ x: number, y: number } | null>(null);
  const [selectionRect, setSelectionRect] = React.useState<{ x: number, y: number, w: number, h: number } | null>(null);
  const [drawingNode, setDrawingNode] = React.useState<EditorNode | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const addNode = (type: EditorNode['type'], st?: EditorNode['shapeType'], initialProps: Partial<EditorNode> = {}) => {
    const newNode: EditorNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      x: 100 + Math.random() * 50,
      y: 100 + Math.random() * 50,
      width: type === 'image' ? 200 : (type === 'line' || type === 'arrow' ? undefined : 150),
      height: type === 'image' ? 120 : (type === 'line' || type === 'arrow' ? undefined : 100),
      color: (type === 'shape' || type === 'line' || type === 'arrow') ? '#3b82f6' : (type === 'note' ? '#fde047' : 'transparent'),
      content: type === 'text' ? 'New Text' : (type === 'note' ? 'New Note' : ''),
      shapeType: st,
      rotation: 0,
      src: type === 'image' ? 'https://picsum.photos/seed/node/400/300' : undefined,
      ...initialProps
    };
    onUpdateNodes([...nodes, newNode]);
    setSelectedIds([newNode.id]);
    return newNode.id;
  };

  const updateNode = (id: string, updates: Partial<EditorNode>) => {
    onUpdateNodes(nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteSelected = () => {
    onUpdateNodes(nodes.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragStart({ x, y });

    if (activeTool === 'pointer') {
      if (!e.shiftKey) setSelectedIds([]);
    } else if (activeTool === 'arrow' || activeTool === 'line' || activeTool === 'shape') {
      // Start drawing
      const initialProps: Partial<EditorNode> = { x, y, x2: x, y2: y };
      if (activeTool === 'shape') {
        initialProps.width = 0;
        initialProps.height = 0;
        initialProps.x2 = undefined;
        initialProps.y2 = undefined;
      }
      const newId = `node-${Date.now()}`;
      const newNode: EditorNode = {
        id: newId,
        type: activeTool === 'shape' ? 'shape' : activeTool,
        x,
        y,
        x2: activeTool === 'shape' ? undefined : x,
        y2: activeTool === 'shape' ? undefined : y,
        width: activeTool === 'shape' ? 0 : undefined,
        height: activeTool === 'shape' ? 0 : undefined,
        color: (activeTool === 'shape' || activeTool === 'line' || activeTool === 'arrow') ? '#3b82f6' : 'transparent',
        rotation: 0,
        shapeType: activeTool === 'shape' ? (shapeType || 'square') : undefined,
        content: ''
      };
      setDrawingNode(newNode);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'pointer') {
      const sx = Math.min(x, dragStart.x);
      const sy = Math.min(y, dragStart.y);
      const sw = Math.abs(x - dragStart.x);
      const sh = Math.abs(y - dragStart.y);
      setSelectionRect({ x: sx, y: sy, w: sw, h: sh });

      // Update selected IDs in real-time
      const newSelected = nodes.filter(n => {
        const isWithin = (px: number, py: number) => px >= sx && px <= sx + sw && py >= sy && py <= sy + sh;
        if (n.type === 'line' || n.type === 'arrow') {
          return isWithin(n.x, n.y) && isWithin(n.x2 || n.x, n.y2 || n.y);
        }
        return n.x >= sx && n.x + (n.width || 0) <= sx + sw &&
               n.y >= sy && n.y + (n.height || 0) <= sy + sh;
      }).map(n => n.id);
      setSelectedIds(newSelected);
    } else if (drawingNode) {
      if (drawingNode.type === 'line' || drawingNode.type === 'arrow') {
        setDrawingNode({ ...drawingNode, x2: x, y2: y });
      } else if (drawingNode.type === 'shape') {
        const sx = Math.min(x, dragStart.x);
        const sy = Math.min(y, dragStart.y);
        const sw = Math.abs(x - dragStart.x);
        const sh = Math.abs(y - dragStart.y);
        setDrawingNode({ ...drawingNode, x: sx, y: sy, width: sw, height: sh });
      }
    }
  };

  const handleMouseUp = () => {
    if (drawingNode) {
      onUpdateNodes([...nodes, drawingNode]);
      setSelectedIds([drawingNode.id]);
      setDrawingNode(null);
    }
    setDragStart(null);
    setSelectionRect(null);
  };

  const handleRotate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === id);
    if (!node || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const cx = node.x + (node.width || 0) / 2;
    const cy = node.y + (node.height || 0) / 2;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const mx = moveEvent.clientX - rect.left;
      const my = moveEvent.clientY - rect.top;
      const angle = Math.atan2(my - cy, mx - cx) * (180 / Math.PI) + 90;
      updateNode(id, { rotation: angle });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleImageImport = () => {
    const url = window.prompt('Enter Image URL:');
    if (url) addNode('image', undefined, { src: url });
  };

  return (
    <div className={cn(
      "w-full h-full min-h-[600px] rounded-3xl overflow-hidden flex flex-col transition-colors border",
      isDarkMode ? "bg-zinc-950/50 border-white/5" : "bg-white border-zinc-200 shadow-xl"
    )}>
      {/* Toolbar */}
      <div className={cn(
        "px-6 py-3 border-b flex items-center justify-between transition-colors sticky top-0 z-[100]",
        isDarkMode ? "bg-zinc-900 border-white/5" : "bg-zinc-50 border-zinc-200"
      )}>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => { setActiveTool('pointer'); setShapeType(null); }}
            className={cn("p-2 rounded-xl transition-all", activeTool === 'pointer' ? "bg-blue-500 text-white shadow-lg" : (isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-900"))}
            title="Select tool"
          >
            <MousePointer2 size={18} />
          </button>
          <div className={cn("w-px h-6 mx-1", isDarkMode ? "bg-white/5" : "bg-zinc-200")} />
          <button 
            onClick={() => { setActiveTool('shape'); setShapeType('square'); }}
            className={cn("p-2 rounded-xl transition-all", activeTool === 'shape' && shapeType === 'square' ? "bg-blue-500 text-white shadow-lg" : (isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-900"))}
            title="Square tool (Drag to draw)"
          >
            <Square size={18} />
          </button>
          <button 
            onClick={() => { setActiveTool('shape'); setShapeType('circle'); }}
            className={cn("p-2 rounded-xl transition-all", activeTool === 'shape' && shapeType === 'circle' ? "bg-blue-500 text-white shadow-lg" : (isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-900"))}
            title="Circle tool (Drag to draw)"
          >
            <Circle size={18} />
          </button>
          <button 
            onClick={() => { setActiveTool('shape'); setShapeType('triangle'); }}
            className={cn("p-2 rounded-xl transition-all", activeTool === 'shape' && shapeType === 'triangle' ? "bg-blue-500 text-white shadow-lg" : (isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-900"))}
            title="Triangle tool (Drag to draw)"
          >
            <Triangle size={18} />
          </button>
          <div className={cn("w-px h-6 mx-1", isDarkMode ? "bg-white/5" : "bg-zinc-200")} />
          <button 
            onClick={() => { setActiveTool('line'); setShapeType(null); }}
            className={cn("p-2 rounded-xl transition-all", activeTool === 'line' ? "bg-blue-500 text-white shadow-lg" : (isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-900"))}
            title="Line tool (Drag to draw)"
          >
            <Minus size={18} className="-rotate-45" />
          </button>
          <button 
            onClick={() => { setActiveTool('arrow'); setShapeType(null); }}
            className={cn("p-2 rounded-xl transition-all", activeTool === 'arrow' ? "bg-blue-500 text-white shadow-lg" : (isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-900"))}
            title="Arrow tool (Drag to draw)"
          >
            <ArrowRight size={18} />
          </button>
          <div className={cn("w-px h-6 mx-1", isDarkMode ? "bg-white/5" : "bg-zinc-200")} />
          <button 
            onClick={() => addNode('text')}
            className={cn("p-2 rounded-xl transition-all", isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-900")}
            title="Add Text"
          >
            <Type size={18} />
          </button>
          <button 
            onClick={() => addNode('note')}
            className={cn("p-2 rounded-xl transition-all", isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-900")}
            title="Add Note"
          >
            <StickyNote size={18} />
          </button>
          <button 
            onClick={handleImageImport}
            className={cn("p-2 rounded-xl transition-all", isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-900")}
            title="Import Image"
          >
            <ImageIcon size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {selectedIds.length > 0 && (
            <button 
              onClick={deleteSelected}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-all shadow-lg"
            >
              <Trash2 size={12} /> Delete ({selectedIds.length})
            </button>
          )}
          <p className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-white/20" : "text-zinc-400")}>Node Editor</p>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-dot-grid select-none"
        style={{ 
          backgroundImage: isDarkMode ? 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)' : 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Selection Rectangle */}
        {selectionRect && (
          <div 
            className="absolute border border-blue-500 bg-blue-500/10 z-[1000] pointer-events-none"
            style={{ left: selectionRect.x, top: selectionRect.y, width: selectionRect.w, height: selectionRect.h }}
          />
        )}

        {/* Temporary Drawing Node */}
        {drawingNode && (
          <div 
            className="absolute pointer-events-none opacity-50 z-[900]"
            style={{ 
              left: drawingNode.x, 
              top: drawingNode.y, 
              width: drawingNode.width, 
              height: drawingNode.height,
              transform: drawingNode.type === 'line' || drawingNode.type === 'arrow' ? undefined : `rotate(${drawingNode.rotation || 0}deg)`
            }}
          >
            {drawingNode.type === 'shape' && (
              <div 
                className={cn(
                  "w-full h-full",
                  drawingNode.shapeType === 'circle' ? "rounded-full" : (drawingNode.shapeType === 'triangle' ? "clip-path-triangle" : "rounded-xl")
                )}
                style={{ backgroundColor: drawingNode.color }}
              />
            )}
            {(drawingNode.type === 'line' || drawingNode.type === 'arrow') && drawingNode.x2 !== undefined && drawingNode.y2 !== undefined && (
              <svg className="absolute inset-0 overflow-visible w-full h-full pointer-events-none">
                <defs>
                  <marker id="draw-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={drawingNode.color} />
                  </marker>
                </defs>
                <line 
                  x1={0} y1={0} 
                  x2={drawingNode.x2 - drawingNode.x} y2={drawingNode.y2 - drawingNode.y} 
                  stroke={drawingNode.color} 
                  strokeWidth="2" 
                  markerEnd={drawingNode.type === 'arrow' ? "url(#draw-arrowhead)" : undefined}
                />
              </svg>
            )}
          </div>
        )}

        <AnimatePresence>
          {nodes.map(node => {
            const isSelected = selectedIds.includes(node.id);
            const isLineOrArrow = node.type === 'line' || node.type === 'arrow';

            return (
              <motion.div
                key={node.id}
                drag={isSelected}
                dragMomentum={false}
                onDragStart={() => setSelectedIds(prev => prev.includes(node.id) ? prev : [node.id])}
                onDragEnd={(_, info) => {
                  if (isSelected && selectedIds.length > 1) {
                    // Update all selected nodes
                    onUpdateNodes(nodes.map(n => 
                      selectedIds.includes(n.id) 
                      ? { ...n, x: n.x + info.offset.x, y: n.y + info.offset.y, x2: n.x2 ? n.x2 + info.offset.x : undefined, y2: n.y2 ? n.y2 + info.offset.y : undefined } 
                      : n
                    ));
                  } else {
                    updateNode(node.id, { 
                      x: node.x + info.offset.x, 
                      y: node.y + info.offset.y,
                      x2: node.x2 ? node.x2 + info.offset.x : undefined,
                      y2: node.y2 ? node.y2 + info.offset.y : undefined
                    });
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.shiftKey) {
                    setSelectedIds(prev => prev.includes(node.id) ? prev.filter(id => id !== node.id) : [...prev, node.id]);
                  } else {
                    setSelectedIds([node.id]);
                  }
                }}
                style={{ 
                  x: node.x, 
                  y: node.y, 
                  width: node.width, 
                  height: node.height, 
                  position: 'absolute', 
                  zIndex: isSelected ? 50 : 10,
                  rotate: isLineOrArrow ? 0 : node.rotation
                }}
                className={cn(
                  "group cursor-move transition-shadow",
                  isSelected ? "ring-2 ring-blue-500 shadow-2xl" : "hover:shadow-lg"
                )}
              >
                {node.type === 'shape' && (
                  <div 
                    className={cn(
                      "w-full h-full flex items-center justify-center",
                      node.shapeType === 'circle' ? "rounded-full" : (node.shapeType === 'triangle' ? "clip-path-triangle" : "rounded-xl")
                    )}
                    style={{ backgroundColor: node.color }}
                  />
                )}
                {node.type === 'text' && (
                  <div className={cn("w-full h-full font-bold transition-colors", isDarkMode ? "text-white" : "text-zinc-900")}>
                    {isSelected && selectedIds.length === 1 ? (
                      <textarea
                        className="w-full h-full bg-transparent border-none outline-none resize-none px-2 py-1"
                        value={node.content}
                        onChange={(e) => updateNode(node.id, { content: e.target.value })}
                      />
                    ) : (
                      <div className="px-2 py-1 select-text">{node.content}</div>
                    )}
                  </div>
                )}
                {node.type === 'note' && (
                  <div 
                    className="w-full h-full p-4 rounded-xl shadow-lg relative bg-[#fef08a] text-zinc-900"
                    style={{ transform: 'rotate(-1deg)' }}
                  >
                    <Pin className="absolute -top-2 left-1/2 -translate-x-1/2 text-red-500" size={14} />
                    {isSelected && selectedIds.length === 1 ? (
                      <textarea
                        className="w-full h-full bg-transparent border-none outline-none resize-none text-xs leading-relaxed"
                        value={node.content}
                        onChange={(e) => updateNode(node.id, { content: e.target.value })}
                      />
                    ) : (
                      <div className="text-xs leading-relaxed select-text">{node.content}</div>
                    )}
                  </div>
                )}
                {node.type === 'image' && (
                  <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/10 bg-black/20 backdrop-blur-md">
                    <img src={node.src} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                {isLineOrArrow && node.x2 !== undefined && node.y2 !== undefined && (
                  <svg 
                    className="absolute inset-0 overflow-visible pointer-events-none" 
                    style={{ width: '1px', height: '1px' }}
                  >
                    <defs>
                      <marker id={`arrowhead-${node.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill={node.color} />
                      </marker>
                    </defs>
                    <line 
                      x1={0} y1={0} 
                      x2={node.x2 - node.x} y2={node.y2 - node.y} 
                      stroke={node.color} 
                      strokeWidth="3" 
                      markerEnd={node.type === 'arrow' ? `url(#arrowhead-${node.id})` : undefined}
                    />
                  </svg>
                )}

                {/* Interaction Overlay (Resizing/Rotation) */}
                <AnimatePresence>
                  {isSelected && selectedIds.length === 1 && (
                    <motion.div 
                      key="handles"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      {/* Rotation Handle */}
                      {!isLineOrArrow && (
                        <div 
                          className="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto shadow-lg hover:scale-110 transition-transform"
                          onMouseDown={(e) => handleRotate(node.id, e)}
                        >
                          <RotateCw size={12} className="text-white" />
                        </div>
                      )}
                      
                      {/* Resize Handle (Bottom-Right) */}
                      {!isLineOrArrow && (
                        <div 
                          className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded shadow-md cursor-nwse-resize pointer-events-auto"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            const startX = e.clientX;
                            const startY = e.clientY;
                            const startW = node.width || 0;
                            const startH = node.height || 0;

                            const onMouseMove = (moveEvent: MouseEvent) => {
                              const dx = moveEvent.clientX - startX;
                              const dy = moveEvent.clientY - startY;
                              updateNode(node.id, { 
                                width: Math.max(20, startW + dx), 
                                height: Math.max(20, startH + dy) 
                              });
                            };

                            const onMouseUp = () => {
                              window.removeEventListener('mousemove', onMouseMove);
                              window.removeEventListener('mouseup', onMouseUp);
                            };

                            window.addEventListener('mousemove', onMouseMove);
                            window.addEventListener('mouseup', onMouseUp);
                          }}
                        />
                      )}

                      {/* Resize Handle for Lines (Target Point) */}
                      {isLineOrArrow && node.x2 !== undefined && node.y2 !== undefined && (
                        <div 
                          className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md cursor-pointer pointer-events-auto"
                          style={{ left: node.x2 - node.x - 8, top: node.y2 - node.y - 8 }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            const onMouseMove = (moveEvent: MouseEvent) => {
                              if (!containerRef.current) return;
                              const rect = containerRef.current.getBoundingClientRect();
                              updateNode(node.id, { 
                                x2: moveEvent.clientX - rect.left, 
                                y2: moveEvent.clientY - rect.top 
                              });
                            };
                            const onMouseUp = () => {
                              window.removeEventListener('mousemove', onMouseMove);
                              window.removeEventListener('mouseup', onMouseUp);
                            };
                            window.addEventListener('mousemove', onMouseMove);
                            window.addEventListener('mouseup', onMouseUp);
                          }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Context Menu / Tooltip Actions */}
                <AnimatePresence>
                  {isSelected && selectedIds.length === 1 && (
                    <motion.div 
                      key="actions"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute -top-16 left-0 right-0 flex justify-center gap-2 pointer-events-none"
                    >
                      <div className={cn(
                        "flex items-center gap-1 p-1 rounded-xl shadow-xl pointer-events-auto border",
                        isDarkMode ? "bg-zinc-900 border-white/10" : "bg-white border-zinc-200"
                      )}>
                        {(node.type === 'shape' || isLineOrArrow) && (
                          <input 
                            type="color" 
                            className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
                            value={node.color}
                            onChange={(e) => updateNode(node.id, { color: e.target.value })}
                          />
                        )}
                        {node.type === 'image' && (
                           <button 
                             onClick={() => {
                               const newUrl = window.prompt('Enter image URL:', node.src);
                               if (newUrl) updateNode(node.id, { src: newUrl });
                             }}
                             className={cn("p-1.5 rounded-lg transition-colors", isDarkMode ? "hover:bg-white/10 text-white/60" : "hover:bg-zinc-100 text-zinc-600")}
                           >
                             <ImageIcon size={14} />
                           </button>
                        )}
                        <button 
                          onClick={() => deleteSelected()}
                          className={cn("p-1.5 rounded-lg transition-colors", isDarkMode ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-50 text-red-600")}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className={cn(
        "px-6 py-2 border-t flex justify-between items-center transition-colors text-[8px] font-bold uppercase tracking-[0.2em]",
        isDarkMode ? "bg-zinc-950 text-white/20 border-white/5" : "bg-zinc-50 text-zinc-400 border-zinc-200"
      )}>
        <div className="flex gap-4">
          <p>Organization & Planning Canvas</p>
          {activeTool !== 'pointer' && <p className="text-blue-500">Active Tool: {activeTool} {shapeType && `(${shapeType})`}</p>}
        </div>
        <p>{nodes.length} Elements on Board</p>
      </div>
    </div>
  );
};

const SceneDetailView = ({ scene, onUpdate, isDarkMode }: { scene: Scene, onUpdate: (updated: Scene, originalId: string) => void, isDarkMode: boolean }) => {
  const [detailMode, setDetailMode] = React.useState<'Overview' | 'NodeEditor'>('Overview');
  const [activeDetailTab, setActiveDetailTab] = React.useState<'History' | 'RenderPasses'>('History');
  const [isAddingNote, setIsAddingNote] = React.useState(false);
  const [isEditingThumbnail, setIsEditingThumbnail] = React.useState(false);
  const [editingHistoryIndex, setEditingHistoryIndex] = React.useState<number | null>(null);
  const [deleteHistoryConfirmIndex, setDeleteHistoryConfirmIndex] = React.useState<number | null>(null);
  const [newNote, setNewNote] = React.useState({ title: '', description: '', categories: [] as string[] });

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#64748b'];
  const categories = [
    { id: 'stage3D', label: 'Layout', color: 'blue' },
    { id: 'lighting', label: 'Shading & Lighting', color: 'orange' },
    { id: 'rendering', label: 'Render', color: 'green' },
    { id: 'compositing', label: 'Comp', color: 'purple' }
  ];

  const addRenderPass = () => {
    const newPass = { name: 'New Pass', progress: 0, color: colors[0] };
    onUpdate({ ...scene, renderPasses: [...scene.renderPasses, newPass] }, scene.id);
  };

  const deleteRenderPass = (index: number) => {
    const newPasses = scene.renderPasses.filter((_, i) => i !== index);
    onUpdate({ ...scene, renderPasses: newPasses }, scene.id);
  };

  const updatePassColor = (index: number, color: string) => {
    const newPasses = [...scene.renderPasses];
    newPasses[index] = { ...newPasses[index], color };
    onUpdate({ ...scene, renderPasses: newPasses }, scene.id);
  };

  const updatePassName = (index: number, name: string) => {
    const newPasses = [...scene.renderPasses];
    newPasses[index] = { ...newPasses[index], name };
    onUpdate({ ...scene, renderPasses: newPasses }, scene.id);
  };

  const handleSubmitNote = () => {
    if (!newNote.title || !newNote.description) return;

    let updatedHistory = [...scene.history];
    if (editingHistoryIndex !== null) {
      updatedHistory[editingHistoryIndex] = {
        ...updatedHistory[editingHistoryIndex],
        update: newNote.title,
        note: newNote.description,
        categories: newNote.categories
      };
      setEditingHistoryIndex(null);
    } else {
      const historyItem = {
        version: scene.version,
        date: new Date().toISOString().split('T')[0],
        update: newNote.title,
        note: newNote.description,
        categories: newNote.categories,
        type: 'note' as const
      };
      updatedHistory = [historyItem, ...updatedHistory];
    }

    // Re-calculate status based on all notes in history
    const updatedStatus = {
      stage3D: { ...scene.status.stage3D, hasNotes: false },
      lighting: { ...scene.status.lighting, hasNotes: false },
      rendering: { ...scene.status.rendering, hasNotes: false },
      compositing: { ...scene.status.compositing, hasNotes: false }
    };

    updatedHistory.forEach(item => {
      if (item.type === 'note' && item.categories) {
        item.categories.forEach(cat => {
          if (cat === 'stage3D') updatedStatus.stage3D.hasNotes = true;
          if (cat === 'lighting') updatedStatus.lighting.hasNotes = true;
          if (cat === 'rendering') updatedStatus.rendering.hasNotes = true;
          if (cat === 'compositing') updatedStatus.compositing.hasNotes = true;
        });
      }
    });

    onUpdate({
      ...scene,
      history: updatedHistory,
      status: updatedStatus
    }, scene.id);

    setNewNote({ title: '', description: '', categories: [] });
    setIsAddingNote(false);
  };

  const handleDeleteHistory = (index: number) => {
    const updatedHistory = scene.history.filter((_, i) => i !== index);
    
    // Re-calculate status based on remaining notes
    const updatedStatus = {
      stage3D: { ...scene.status.stage3D, hasNotes: false },
      lighting: { ...scene.status.lighting, hasNotes: false },
      rendering: { ...scene.status.rendering, hasNotes: false },
      compositing: { ...scene.status.compositing, hasNotes: false }
    };

    updatedHistory.forEach(item => {
      if (item.type === 'note' && item.categories) {
        item.categories.forEach(cat => {
          if (cat === 'stage3D') updatedStatus.stage3D.hasNotes = true;
          if (cat === 'lighting') updatedStatus.lighting.hasNotes = true;
          if (cat === 'rendering') updatedStatus.rendering.hasNotes = true;
          if (cat === 'compositing') updatedStatus.compositing.hasNotes = true;
        });
      }
    });

    onUpdate({
      ...scene,
      history: updatedHistory,
      status: updatedStatus
    }, scene.id);
    setDeleteHistoryConfirmIndex(null);
  };

  const handleEditHistory = (index: number) => {
    const item = scene.history[index];
    setNewNote({
      title: item.update,
      description: item.note,
      categories: item.categories || []
    });
    setEditingHistoryIndex(index);
    setIsAddingNote(true);
  };

  const toggleCategory = (catId: string) => {
    setNewNote(prev => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter(c => c !== catId)
        : [...prev.categories, catId]
    }));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...scene, thumbnail: reader.result as string }, scene.id);
        setIsEditingThumbnail(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUrlSubmit = (url: string) => {
    if (url) {
      onUpdate({ ...scene, thumbnail: url }, scene.id);
      setIsEditingThumbnail(false);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'model': return <Box size={14} />;
      case 'texture': return <Layers size={14} />;
      case 'sim': return <Wind size={14} />;
      default: return <FolderOpen size={14} />;
    }
  };

  return (
    <div className={cn("h-full flex flex-col transition-colors", isDarkMode ? "bg-zinc-950" : "bg-zinc-50")}>
      <div className="p-8 flex-1 overflow-y-auto space-y-8">
        <div className="flex items-center gap-6 border-b border-white/5 pb-6">
          <button 
            onClick={() => setDetailMode('Overview')}
            className={cn(
              "text-sm font-bold uppercase tracking-[0.2em] transition-all relative pb-2",
              detailMode === 'Overview' 
                ? (isDarkMode ? "text-white" : "text-zinc-900") 
                : (isDarkMode ? "text-white/20 hover:text-white/40" : "text-zinc-400 hover:text-zinc-600")
            )}
          >
            Overview
            {detailMode === 'Overview' && <motion.div layoutId="detailMode" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
          </button>
          <button 
            onClick={() => setDetailMode('NodeEditor')}
            className={cn(
              "text-sm font-bold uppercase tracking-[0.2em] transition-all relative pb-2",
              detailMode === 'NodeEditor' 
                ? (isDarkMode ? "text-white" : "text-zinc-900") 
                : (isDarkMode ? "text-white/20 hover:text-white/40" : "text-zinc-400 hover:text-zinc-600")
            )}
          >
            Node Editor
            {detailMode === 'NodeEditor' && <motion.div layoutId="detailMode" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {detailMode === 'Overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12"
            >
          <div className="space-y-8">
            <div className="space-y-6">
              <div className={cn(
                "aspect-video rounded-3xl overflow-hidden border transition-all relative group",
                isDarkMode ? "border-white/10 bg-black" : "border-zinc-200 bg-white shadow-xl"
              )}>
                <img src={scene.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                
                {/* Thumbnail change disabled in demo */}

                <AnimatePresence>
                  {isEditingThumbnail && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 space-y-6 z-50"
                    >
                      <button 
                        onClick={() => setIsEditingThumbnail(false)}
                        className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                      
                      <div className="text-center space-y-2">
                        <h3 className="text-white font-bold">Update Thumbnail</h3>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest">Link a URL or upload an image</p>
                      </div>

                      <div className="w-full max-w-xs space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Image URL</label>
                          <input 
                            autoFocus
                            placeholder="https://..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-white/30 transition-all"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleThumbnailUrlSubmit((e.target as HTMLInputElement).value);
                              }
                            }}
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                          </div>
                          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                            <span className="bg-transparent px-2 text-white/20">or</span>
                          </div>
                        </div>

                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all group">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Download size={20} className="text-white/20 group-hover:text-white/40 transition-colors mb-2" />
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Upload File</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Detail Tabs */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <button 
                    onClick={() => setActiveDetailTab('History')}
                    className={cn(
                      "text-xs font-bold uppercase tracking-widest transition-all relative pb-2",
                      activeDetailTab === 'History' 
                        ? (isDarkMode ? "text-white" : "text-zinc-900") 
                        : (isDarkMode ? "text-white/30 hover:text-white/60" : "text-zinc-400 hover:text-zinc-600")
                    )}
                  >
                    Version History
                    {activeDetailTab === 'History' && <motion.div layoutId="detailTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                  </button>
                  <button 
                    onClick={() => setActiveDetailTab('RenderPasses')}
                    className={cn(
                      "text-xs font-bold uppercase tracking-widest transition-all relative pb-2",
                      activeDetailTab === 'RenderPasses' 
                        ? (isDarkMode ? "text-white" : "text-zinc-900") 
                        : (isDarkMode ? "text-white/30 hover:text-white/60" : "text-zinc-400 hover:text-zinc-600")
                    )}
                  >
                    Render Passes
                    {activeDetailTab === 'RenderPasses' && <motion.div layoutId="detailTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                  </button>
                </div>

                {activeDetailTab === 'History' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className={cn("text-2xl font-bold transition-colors", isDarkMode ? "text-white" : "text-zinc-900")}>Version History</h2>
                      <button 
                        onClick={() => {
                          setIsAddingNote(!isAddingNote);
                          if (!isAddingNote) {
                            setEditingHistoryIndex(null);
                            setNewNote({ title: '', description: '', categories: [] });
                          }
                        }}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                          isDarkMode 
                            ? "border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10" 
                            : "border-yellow-400 text-yellow-600 hover:bg-yellow-50 shadow-sm"
                        )}
                      >
                        <Plus size={14} /> Add Note
                      </button>
                    </div>

                    <AnimatePresence>
                      {isAddingNote && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={cn(
                            "border rounded-2xl p-6 space-y-4 transition-colors",
                            isDarkMode ? "bg-zinc-900/50 border-white/10" : "bg-white border-zinc-200 shadow-md"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <input 
                              placeholder="Note Title"
                              className={cn(
                                "flex-1 bg-transparent border-b outline-none py-1 text-sm font-bold",
                                isDarkMode ? "text-white border-white/10 focus:border-white/30" : "text-zinc-900 border-zinc-200 focus:border-zinc-400"
                              )}
                              value={newNote.title}
                              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                            />
                            <div className="flex gap-1">
                              {categories.map(cat => (
                                <button
                                  key={cat.id}
                                  onClick={() => toggleCategory(cat.id)}
                                  className={cn(
                                    "px-2 py-1 rounded text-[8px] font-bold uppercase transition-all",
                                    newNote.categories.includes(cat.id)
                                      ? `bg-${cat.color}-500 text-white shadow-lg shadow-${cat.color}-500/20`
                                      : (isDarkMode ? "bg-white/5 text-white/40 hover:bg-white/10" : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200")
                                  )}
                                >
                                  {cat.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="relative">
                            <textarea 
                              placeholder="Note Description"
                              className={cn(
                                "w-full bg-transparent border rounded-xl p-4 outline-none resize-none h-24 text-xs leading-relaxed",
                                isDarkMode ? "text-white/60 border-white/10 focus:border-white/30" : "text-zinc-500 border-zinc-200 focus:border-zinc-400"
                              )}
                              value={newNote.description}
                              onChange={(e) => setNewNote(prev => ({ ...prev, description: e.target.value }))}
                            />
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                              <button className={cn("p-1.5 rounded-lg transition-colors", isDarkMode ? "text-white/20 hover:text-white/60 hover:bg-white/5" : "text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100")}>
                                <ImageIcon size={14} />
                              </button>
                              <button className={cn("p-1.5 rounded-lg transition-colors", isDarkMode ? "text-white/20 hover:text-white/60 hover:bg-white/5" : "text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100")}>
                                <Link size={14} />
                              </button>
                            </div>
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  setNewNote({ title: '', description: '', categories: [] });
                                  setIsAddingNote(false);
                                  setEditingHistoryIndex(null);
                                }}
                                className={cn(
                                  "p-1.5 rounded-lg transition-colors",
                                  isDarkMode ? "text-white/20 hover:text-red-400 hover:bg-white/5" : "text-zinc-300 hover:text-red-500 hover:bg-zinc-100"
                                )}
                              >
                                <Trash2 size={14} />
                              </button>
                              <button 
                                onClick={handleSubmitNote}
                                className={cn(
                                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                  isDarkMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                                )}
                              >
                                <Send size={12} /> {editingHistoryIndex !== null ? 'Update' : 'Submit'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-4">
                      {scene.history.map((item, i) => (
                        <div key={i} className={cn(
                          "border rounded-2xl p-6 space-y-3 transition-colors relative group",
                          isDarkMode ? "bg-zinc-900/50 border-white/5" : "bg-white border-zinc-200 shadow-sm",
                          item.type === 'note' && (isDarkMode ? "border-yellow-500/50" : "border-yellow-400")
                        )}>
                          <div className="absolute bottom-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                              onClick={() => handleEditHistory(i)}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                isDarkMode ? "text-white/20 hover:text-white hover:bg-white/5" : "text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100"
                              )}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => setDeleteHistoryConfirmIndex(i)}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                isDarkMode ? "text-white/20 hover:text-red-400 hover:bg-white/5" : "text-zinc-300 hover:text-red-500 hover:bg-zinc-100"
                              )}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "px-2 py-1 rounded text-[10px] font-bold transition-colors",
                                isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-600"
                              )}>{item.version}</span>
                              <div className="flex gap-1">
                                {item.categories?.map(catId => {
                                  const cat = categories.find(c => c.id === catId);
                                  return cat ? (
                                    <span key={catId} className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold uppercase", `bg-${cat.color}-500/20 text-${cat.color}-400`)}>
                                      {cat.label}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </div>
                            <span className={cn("text-[10px] flex items-center gap-1 transition-colors", isDarkMode ? "text-white/30" : "text-zinc-400")}><Clock size={10} /> {item.date}</span>
                          </div>
                          <p className={cn("text-sm font-medium transition-colors", isDarkMode ? "text-white" : "text-zinc-900")}>{item.update}</p>
                          <p className={cn("text-xs leading-relaxed transition-colors", isDarkMode ? "text-white/50" : "text-zinc-500")}>{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeDetailTab === 'RenderPasses' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className={cn("text-2xl font-bold transition-colors", isDarkMode ? "text-white" : "text-zinc-900")}>Render Passes</h2>
                      <button 
                        onClick={addRenderPass}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all",
                          isDarkMode 
                            ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white" 
                            : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                        )}
                      >
                        <Plus size={12} /> Add Pass
                      </button>
                    </div>
                    <div className="space-y-2">
                      {scene.renderPasses.map((pass, i) => (
                        <div key={i} 
                          className={cn(
                            "border rounded-full py-2 px-4 flex items-center gap-4 transition-all shadow-sm",
                            isDarkMode ? "border-white/10" : "border-zinc-200"
                          )}
                          style={{ backgroundColor: pass.color }}
                        >
                          <div className="flex-1 flex items-center gap-3">
                            <input 
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-widest bg-transparent border-b border-transparent focus:border-white/50 outline-none transition-all flex-1 text-white placeholder:text-white/50"
                              )}
                              value={pass.name}
                              onChange={(e) => updatePassName(i, e.target.value)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-white/20 text-white/70 hover:text-white">
                              <input 
                                type="color" 
                                className="sr-only"
                                value={pass.color}
                                onChange={(e) => updatePassColor(i, e.target.value)}
                              />
                              <Palette size={14} />
                            </label>
                            <button 
                              onClick={() => deleteRenderPass(i)}
                              className="p-1.5 transition-colors text-white/50 hover:text-white"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className={cn(
              "border rounded-3xl p-6 space-y-6 transition-colors",
              isDarkMode ? "bg-zinc-900/50 border-white/5" : "bg-white border-zinc-200 shadow-sm"
            )}>
              <h3 className={cn("text-sm font-bold uppercase tracking-widest transition-colors", isDarkMode ? "text-white" : "text-zinc-900")}>Scene Specs</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className={cn("text-[10px] uppercase font-bold transition-colors", isDarkMode ? "text-white/40" : "text-zinc-400")}>3D Scene</p>
                  <p className={cn("text-xs break-all transition-colors", isDarkMode ? "text-white" : "text-zinc-600")}>{scene.sceneFile}</p>
                </div>
                <div className="space-y-1">
                  <p className={cn("text-[10px] uppercase font-bold transition-colors", isDarkMode ? "text-white/40" : "text-zinc-400")}>Compositing</p>
                  <p className={cn("text-xs break-all transition-colors", isDarkMode ? "text-white" : "text-zinc-600")}>{scene.compFile}</p>
                </div>
                <div className="space-y-1">
                  <p className={cn("text-[10px] uppercase font-bold transition-colors", isDarkMode ? "text-white/40" : "text-zinc-400")}>Render Path</p>
                  <p className={cn("text-xs break-all transition-colors", isDarkMode ? "text-white" : "text-zinc-600")}>{scene.renderFolder}</p>
                </div>
                <div className={cn("pt-4 border-t flex justify-between transition-colors", isDarkMode ? "border-white/5" : "border-zinc-100")}>
                  <div className="text-center">
                    <p className={cn("text-[10px] uppercase font-bold transition-colors", isDarkMode ? "text-white/40" : "text-zinc-400")}>Duration</p>
                    <p className={cn("text-lg font-bold transition-colors", isDarkMode ? "text-white" : "text-zinc-900")}>{scene.duration}s</p>
                  </div>
                  <div className="text-center">
                    <p className={cn("text-[10px] uppercase font-bold transition-colors", isDarkMode ? "text-white/40" : "text-zinc-400")}>Cost</p>
                    <p className="text-lg font-bold text-green-400">${scene.cost}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={cn(
              "border rounded-3xl p-6 space-y-6 transition-colors",
              isDarkMode ? "bg-zinc-900/50 border-white/5" : "bg-white border-zinc-200 shadow-sm"
            )}>
              <h3 className={cn("text-sm font-bold uppercase tracking-widest transition-colors", isDarkMode ? "text-white" : "text-zinc-900")}>Assets</h3>
              <div className="space-y-3">
                {scene.assets.map((asset, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl group transition-colors",
                    isDarkMode ? "bg-white/5 hover:bg-white/10" : "bg-zinc-50 hover:bg-zinc-100"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      isDarkMode ? "bg-zinc-800 text-white/40 group-hover:text-blue-400" : "bg-white text-zinc-400 group-hover:text-blue-600 shadow-sm"
                    )}>
                      {getAssetIcon(asset.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[10px] font-medium truncate transition-colors", isDarkMode ? "text-white" : "text-zinc-900")}>{asset.name}</p>
                      <p className={cn("text-[8px] uppercase tracking-wider transition-colors", isDarkMode ? "text-white/40" : "text-zinc-500")}>{asset.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
      <motion.div
        key="node-editor"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full h-full min-h-[600px]"
      >
        <NodeEditor 
          scene={scene}
          isDarkMode={isDarkMode}
          onUpdateNodes={(nodes) => onUpdate({ ...scene, nodeEditorData: { nodes } }, scene.id)}
        />
      </motion.div>
    )}
  </AnimatePresence>
</div>

    {/* Delete History Confirmation Overlay */}
      <AnimatePresence>
        {deleteHistoryConfirmIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-sm rounded-3xl p-8 space-y-6 shadow-2xl border",
                isDarkMode ? "bg-zinc-900 border-white/10" : "bg-white border-zinc-200"
              )}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                  isDarkMode ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-500"
                )}>
                  <Trash2 size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className={cn("text-xl font-bold transition-colors", isDarkMode ? "text-white" : "text-zinc-900")}>Delete Version?</h3>
                  <p className={cn("text-sm transition-colors", isDarkMode ? "text-white/40" : "text-zinc-500")}>
                    Are you sure you want to remove this version from history? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteHistoryConfirmIndex(null)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                    isDarkMode ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  )}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeleteHistory(deleteHistoryConfirmIndex)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App({ isDemo = false, onExitDemo }: { isDemo?: boolean; onExitDemo?: () => void } = {}) {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (isDemo) return false;
    try {
      const saved = localStorage.getItem('soda-can-dark-mode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });
  const [scenes, setScenes] = React.useState<Scene[]>(() => {
    if (isDemo) return MOCK_SCENES.map(s => ({ ...s }));
    try {
      const saved = localStorage.getItem('soda-can-scenes');
      if (!saved) return MOCK_SCENES;
      const parsed = JSON.parse(saved) as Scene[];
      return parsed.map(s => {
        const mock = MOCK_SCENES.find(m => m.id === s.id) || MOCK_SCENES[0];
        return {
          ...s,
          schedule: s.schedule || mock.schedule,
          budgetCategories: s.budgetCategories || mock.budgetCategories || []
        };
      });
    } catch (e) {
      return MOCK_SCENES;
    }
  });
  const [activeTab, setActiveTab] = React.useState<TabType>(() => {
    if (isDemo) return 'Project';
    try {
      const saved = localStorage.getItem('soda-can-active-tab');
      return (saved as TabType) || 'Project';
    } catch (e) {
      return 'Project';
    }
  });
  const [openSceneIds, setOpenSceneIds] = React.useState<string[]>(() => {
    if (isDemo) return [];
    try {
      const saved = localStorage.getItem('soda-can-open-scenes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [activeSceneId, setActiveSceneId] = React.useState<string | null>(() => {
    if (isDemo) return null;
    try {
      const saved = localStorage.getItem('soda-can-active-scene');
      return saved || null;
    } catch (e) {
      return null;
    }
  });
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list' | 'timeline'>(() => {
    try {
      const saved = localStorage.getItem('soda-can-view-mode');
      return (saved as 'grid' | 'list' | 'timeline') || 'grid';
    } catch (e) {
      return 'grid';
    }
  });

  const [globalNodeData, setGlobalNodeData] = React.useState<{ nodes: EditorNode[] }>(() => {
    if (isDemo) return { nodes: [] };
    try {
      const saved = localStorage.getItem('soda-can-global-nodes');
      return saved ? JSON.parse(saved) : { nodes: [] };
    } catch (e) {
      return { nodes: [] };
    }
  });

  React.useEffect(() => {
    if (isDemo) return;
    try {
      localStorage.setItem('soda-can-global-nodes', JSON.stringify(globalNodeData));
    } catch (e) {
      console.error('Failed to save global nodes:', e);
    }
  }, [globalNodeData, isDemo]);

  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  // Persistence Effects (skipped in demo mode)
  React.useEffect(() => {
    if (isDemo) return;
    try { localStorage.setItem('soda-can-view-mode', viewMode); } catch (e) { console.error(e); }
  }, [viewMode, isDemo]);

  React.useEffect(() => {
    if (isDemo) return;
    try { localStorage.setItem('soda-can-scenes', JSON.stringify(scenes)); } catch (e) { console.error(e); }
  }, [scenes, isDemo]);

  React.useEffect(() => {
    if (isDemo) return;
    try { localStorage.setItem('soda-can-dark-mode', JSON.stringify(isDarkMode)); } catch (e) { console.error(e); }
  }, [isDarkMode, isDemo]);

  React.useEffect(() => {
    if (isDemo) return;
    try { localStorage.setItem('soda-can-active-tab', activeTab); } catch (e) { console.error(e); }
  }, [activeTab, isDemo]);

  React.useEffect(() => {
    if (isDemo) return;
    try { localStorage.setItem('soda-can-open-scenes', JSON.stringify(openSceneIds)); } catch (e) { console.error(e); }
  }, [openSceneIds, isDemo]);

  React.useEffect(() => {
    if (isDemo) return;
    try {
      if (activeSceneId) {
        localStorage.setItem('soda-can-active-scene', activeSceneId);
      } else {
        localStorage.removeItem('soda-can-active-scene');
      }
    } catch (e) {
      console.error('Failed to save active scene:', e);
    }
  }, [activeSceneId, isDemo]);

  const handleResetProject = () => {
    if (window.confirm('Are you sure you want to reset the project to its default state? All your changes will be lost.')) {
      setScenes(MOCK_SCENES);
      setOpenSceneIds([]);
      setActiveSceneId(null);
      setActiveTab('Project');
      try {
        localStorage.removeItem('soda-can-scenes');
        localStorage.removeItem('soda-can-open-scenes');
        localStorage.removeItem('soda-can-active-scene');
        localStorage.removeItem('soda-can-active-tab');
      } catch (e) {
        console.error('Failed to clear localStorage:', e);
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const openSceneTabs = scenes.filter(s => openSceneIds.includes(s.id));

  const handleSceneClick = (scene: Scene) => {
    if (isEditMode) return;
    if (!openSceneIds.includes(scene.id)) {
      setOpenSceneIds([...openSceneIds, scene.id]);
    }
    setActiveSceneId(scene.id);
  };

  const closeSceneTab = (id: string) => {
    const newIds = openSceneIds.filter(sid => sid !== id);
    setOpenSceneIds(newIds);
    if (activeSceneId === id) {
      setActiveSceneId(null);
    }
  };

  const updateScene = (updated: Scene, originalId: string) => {
    setScenes(scenes.map(s => s.id === originalId ? updated : s));
    // Also update openSceneIds if the ID changed
    if (updated.id !== originalId) {
      setOpenSceneIds(openSceneIds.map(id => id === originalId ? updated.id : id));
      if (activeSceneId === originalId) setActiveSceneId(updated.id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setScenes((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const duplicateScene = (id: string) => {
    const sceneToDuplicate = scenes.find(s => s.id === id);
    if (sceneToDuplicate) {
      const newId = `sc${Date.now()}`;
      const newScene = {
        ...sceneToDuplicate,
        id: newId,
        title: `${sceneToDuplicate.title} (Copy)`,
      };
      const index = scenes.findIndex(s => s.id === id);
      const newScenes = [...scenes];
      newScenes.splice(index + 1, 0, newScene);
      setScenes(newScenes);
    }
  };

  const deleteScene = (id: string) => {
    setScenes(scenes.filter(s => s.id !== id));
    setOpenSceneIds(openSceneIds.filter(sid => sid !== id));
    if (activeSceneId === id) setActiveSceneId(null);
  };

  const addSceneAtPosition = (index: number) => {
    const newId = `sc${Date.now()}`;
    const newScene: Scene = {
      ...MOCK_SCENES[0],
      id: newId,
      title: 'New Scene',
      description: 'Add description here...',
      cost: 1000,
      progress: { stage3D: 0, lighting: 0, rendering: 0, compositing: 0 },
      schedule: {
        stage3D: { start: 0, duration: 2 },
        lighting: { start: 2, duration: 2 },
        rendering: { start: 4, duration: 2 },
        compositing: { start: 6, duration: 2 }
      },
      status: {
        stage3D: { completed: false, hasNotes: false },
        lighting: { completed: false, hasNotes: false },
        rendering: { completed: false, hasNotes: false },
        compositing: { completed: false, hasNotes: false }
      }
    };
    const newScenes = [...scenes];
    newScenes.splice(index, 0, newScene);
    setScenes(newScenes);
  };

  const handleExportProject = () => {
    const data = {
      scenes,
      globalNodeData,
      isDarkMode,
      viewMode,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soda-project-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          try {
            const data = JSON.parse(re.target?.result as string);
            if (data.scenes) setScenes(data.scenes);
            if (data.globalNodeData) setGlobalNodeData(data.globalNodeData);
            if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);
            if (data.viewMode) setViewMode(data.viewMode);
            alert('Project imported successfully!');
          } catch (err) {
            alert('Failed to import project. Invalid file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Demo Banner */}
      {isDemo && (
        <div className="flex-shrink-0 flex items-center gap-4 px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-600 text-white text-xs font-semibold z-[100] shadow-lg shadow-blue-900/40">
          <button
            onClick={onExitDemo}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors font-bold whitespace-nowrap"
          >
            ← Back to Landing
          </button>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-200 animate-pulse" />
            <span className="uppercase tracking-widest opacity-90">Demo Mode</span>
            <span className="opacity-50 mx-2">·</span>
            <span className="opacity-70 font-normal">Changes are temporary and reset when you leave.</span>
          </div>
        </div>
      )}
    <div className={cn(
      "flex flex-1 min-h-0 font-sans overflow-hidden transition-colors duration-500",
      isDarkMode ? "dark bg-black text-white" : "bg-zinc-50 text-zinc-900"
    )}>
      {/* Sidebar */}
      <aside className={cn(
        "w-24 flex flex-col items-center py-8 z-50 border-r transition-colors duration-500",
        isDarkMode ? "bg-zinc-950 border-white/5" : "bg-white border-zinc-200 shadow-xl"
      )}>
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center mb-12 shadow-lg transition-all duration-500",
          isDarkMode ? "bg-blue-600 shadow-blue-600/20" : "bg-blue-500 shadow-blue-500/30"
        )}>
          <LayoutGrid className="text-white" size={24} />
        </div>
        
        <nav className="flex-1">
          <SidebarItem 
            icon={LayoutGrid} 
            label="Project" 
            active={activeTab === 'Project' && !activeSceneId} 
            onClick={() => { setActiveTab('Project'); setActiveSceneId(null); }} 
            isDarkMode={isDarkMode}
          />
          <SidebarItem 
            icon={BarChart3} 
            label="Budget" 
            active={activeTab === 'Budget' && !activeSceneId} 
            onClick={() => { setActiveTab('Budget'); setActiveSceneId(null); }} 
            isDarkMode={isDarkMode}
          />
          <SidebarItem 
            icon={Calendar} 
            label="Schedule" 
            active={activeTab === 'Schedule' && !activeSceneId} 
            onClick={() => { setActiveTab('Schedule'); setActiveSceneId(null); }} 
            isDarkMode={isDarkMode}
          />
          <SidebarItem 
            icon={ImageIcon} 
            label="Refs" 
            active={activeTab === 'References' && !activeSceneId} 
            onClick={() => { setActiveTab('References'); setActiveSceneId(null); }} 
            isDarkMode={isDarkMode}
          />
          <SidebarItem 
            icon={Network} 
            label="Nodes" 
            active={activeTab === 'Nodes' && !activeSceneId} 
            onClick={() => { setActiveTab('Nodes'); setActiveSceneId(null); }} 
            isDarkMode={isDarkMode}
          />
        </nav>

        <div className="mt-auto flex flex-col items-center gap-4">
          <button
            onClick={handleResetProject}
            title="Reset Project"
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              isDarkMode 
                ? "bg-zinc-900 text-zinc-500 hover:bg-white/5 border border-white/5" 
                : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200 border border-zinc-200 shadow-sm"
            )}
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              isDarkMode 
                ? "bg-zinc-900 text-yellow-400 hover:bg-zinc-800 border border-white/5" 
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200 shadow-sm"
            )}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className={cn(
            "w-10 h-10 rounded-full overflow-hidden border transition-colors",
            isDarkMode ? "bg-zinc-800 border-white/10" : "bg-zinc-200 border-zinc-300 shadow-sm"
          )}>
            <img src="https://picsum.photos/seed/user/100/100" alt="User" referrerPolicy="no-referrer" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 flex flex-col min-w-0 transition-colors duration-500",
        isDarkMode ? "bg-zinc-950" : "bg-zinc-50"
      )}>
        {/* Top Tabs Bar */}
        <div className={cn(
          "h-14 border-b flex items-center px-4 gap-1 overflow-x-auto no-scrollbar transition-colors duration-500",
          isDarkMode ? "bg-zinc-950 border-white/5" : "bg-white border-zinc-200"
        )}>
          <button
            onClick={() => setActiveSceneId(null)}
            className={cn(
              "px-6 h-10 rounded-t-xl text-xs font-semibold transition-all flex items-center gap-2 border-b-2",
              !activeSceneId 
                ? (isDarkMode ? "bg-white/5 text-white border-blue-500" : "bg-zinc-50 text-zinc-900 border-blue-500 shadow-sm") 
                : (isDarkMode ? "text-white/40 hover:text-white/60 border-transparent" : "text-zinc-400 hover:text-zinc-600 border-transparent")
            )}
          >
            {activeTab}
          </button>

          {openSceneTabs.map((scene) => (
            <div 
              key={scene.id}
              className={cn(
                "group flex items-center h-10 rounded-t-xl border-b-2 transition-all",
                activeSceneId === scene.id 
                  ? (isDarkMode ? "bg-white/5 border-blue-500" : "bg-white border-blue-500 shadow-sm") 
                  : "border-transparent"
              )}
            >
              <button
                onClick={() => setActiveSceneId(scene.id)}
                className={cn(
                  "px-4 text-xs font-semibold transition-all whitespace-nowrap",
                  activeSceneId === scene.id 
                    ? (isDarkMode ? "text-white" : "text-zinc-900") 
                    : (isDarkMode ? "text-white/40 hover:text-white/60" : "text-zinc-400 hover:text-zinc-600")
                )}
              >
                <span className={cn("mr-2", activeSceneId === scene.id ? "text-blue-400" : "text-blue-500")}>
                  {scene.id.toUpperCase()}
                </span>
                {scene.title}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); closeSceneTab(scene.id); }}
                className={cn(
                  "pr-3 transition-colors",
                  isDarkMode ? "text-white/20 hover:text-white" : "text-zinc-300 hover:text-zinc-600"
                )}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeSceneId ? (
              <motion.div
                key={`scene-${activeSceneId}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-0"
              >
                <SceneDetailView 
                  scene={scenes.find(s => s.id === activeSceneId)!} 
                  onUpdate={updateScene}
                  isDarkMode={isDarkMode}
                />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute inset-0"
              >
                {activeTab === 'Nodes' && (
                  <div className="h-full">
                    <NodeEditor 
                      scene={{ 
                        id: 'global', 
                        title: 'Global Graph', 
                        nodeEditorData: globalNodeData 
                      } as Scene}
                      onUpdateNodes={(nodes) => setGlobalNodeData({ nodes })}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                )}
                {activeTab === 'Project' && (
                  <div className="p-8 h-full overflow-y-auto space-y-6">
                    {/* Project Header & Progress */}
                    {(() => {
                      const totalProjectDuration = scenes.reduce((acc, s) => acc + s.duration, 0);
                      const totalProjectBudget = scenes.reduce((acc, s) => acc + s.cost, 0);
                      const totalStages = scenes.length * 4;
                      const completedStages = scenes.reduce((acc, s) => {
                        return acc + [
                          s.status.stage3D.completed,
                          s.status.lighting.completed,
                          s.status.rendering.completed,
                          s.status.compositing.completed
                        ].filter(Boolean).length;
                      }, 0);
                      const projectCompletion = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <h1 className={cn("text-2xl font-bold transition-colors", isDarkMode ? "text-white" : "text-zinc-900")}>Soda Can 3D Product Animation</h1>
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "px-4 py-1.5 border rounded-lg text-xs font-bold transition-colors",
                                  isDarkMode ? "bg-zinc-900 border-white/10 text-white/80" : "bg-white border-zinc-200 text-zinc-600 shadow-sm"
                                )}>
                                  {(() => {
                                    const mins = Math.floor(totalProjectDuration / 60);
                                    const secs = Math.floor(totalProjectDuration % 60);
                                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                                  })()}
                                </div>
                                <div className={cn(
                                  "px-4 py-1.5 border rounded-lg text-xs font-bold transition-colors",
                                  isDarkMode ? "bg-zinc-900 border-white/10 text-white/80" : "bg-white border-zinc-200 text-zinc-600 shadow-sm"
                                )}>
                                  2560x1440
                                </div>
                                <div className={cn(
                                  "px-4 py-1.5 border rounded-lg text-xs font-bold transition-colors",
                                  isDarkMode ? "bg-zinc-900 border-white/10 text-white/80" : "bg-white border-zinc-200 text-zinc-600 shadow-sm"
                                )}>
                                  30FPS
                                </div>
                                <div className={cn(
                                  "px-4 py-1.5 border rounded-lg text-xs font-bold transition-colors",
                                  isDarkMode ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-green-50 border-green-200 text-green-600 shadow-sm"
                                )}>
                                  ${totalProjectBudget.toLocaleString()}
                                </div>
                                <div className={cn(
                                  "px-4 py-1.5 border rounded-lg text-xs font-bold transition-colors",
                                  isDarkMode ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                                )}>
                                  {projectCompletion}% Complete
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={cn(
                            "space-y-0 shadow-2xl rounded-2xl border-2 transition-colors isolate relative",
                            isDarkMode ? "border-white/20" : "border-zinc-300"
                          )}>
                            <div className="rounded-[14px] overflow-hidden">
                              <div className={cn(
                                "h-6 w-full flex transition-colors relative",
                                isDarkMode ? "bg-zinc-900/50" : "bg-zinc-100"
                              )}>
                                {scenes.map((scene, index) => {
                                const widthPercent = (scene.duration / totalProjectDuration) * 100;
                                return (
                                  <button 
                                    key={scene.id}
                                    onClick={() => handleSceneClick(scene)}
                                    style={{ width: `${widthPercent}%` }}
                                    className={cn(
                                      "h-full relative overflow-hidden transition-all duration-300 border-r last:border-r-0 p-[2px] hover:bg-white/10",
                                      isDarkMode ? "border-white/10" : "border-zinc-200"
                                    )}
                                  >
                                    <div className="flex w-full h-full gap-[2px]">
                                      {[
                                        { id: 'stage3D', color: 'blue', status: scene.status.stage3D },
                                        { id: 'lighting', color: 'orange', status: scene.status.lighting },
                                        { id: 'rendering', color: 'emerald', status: scene.status.rendering },
                                        { id: 'compositing', color: 'purple', status: scene.status.compositing },
                                      ].map((stage) => (
                                        <div 
                                          key={stage.id}
                                          className={cn(
                                            "flex-1 h-full transition-all duration-500 rounded-sm",
                                            stage.status.completed 
                                              ? (stage.color === 'blue' ? "bg-blue-500" :
                                                 stage.color === 'orange' ? "bg-orange-500" :
                                                 stage.color === 'emerald' ? "bg-emerald-500" :
                                                 "bg-purple-500") 
                                              : (isDarkMode ? "bg-white/5" : "bg-white/30")
                                          )}
                                        />
                                      ))}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex w-full border-t overflow-hidden relative" style={{ borderTopColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}>
                              {scenes.map((scene, index) => (
                                <button 
                                  key={scene.id} 
                                  onClick={() => handleSceneClick(scene)}
                                  style={{ width: `${(scene.duration / totalProjectDuration) * 100}%` }} 
                                  className={cn(
                                    "relative h-20 min-w-0 border-r last:border-r-0 group transition-all duration-300",
                                    isDarkMode ? "border-white/10" : "border-zinc-200"
                                  )}
                                >
                                  <img 
                                    src={scene.thumbnail} 
                                    alt={scene.title} 
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                                    referrerPolicy="no-referrer" 
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none group-hover:from-black/70" />
                                  <div className="absolute bottom-0 left-0 right-0 px-2 pb-1.5 flex justify-between items-center transform translate-y-0 transition-transform group-hover:-translate-y-0.5">
                                    <span 
                                      className="text-[10px] font-black uppercase tracking-tight"
                                      style={{ color: scene.color }}
                                    >
                                      {scene.id}
                                    </span>
                                    <span className="text-[10px] font-mono text-white font-medium drop-shadow-md">
                                      {scene.duration}s
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                    <div className="space-y-4">
                      <div className={cn(
                        "flex items-center justify-between sticky top-[-32px] z-30 py-4 -mx-8 px-8 transition-colors border-b shadow-sm",
                        isDarkMode ? "bg-zinc-950/80 backdrop-blur-md border-white/5" : "bg-zinc-50/80 backdrop-blur-md border-zinc-200"
                      )}>
                        <div className="flex items-center gap-6">
                          <h2 className={cn("text-xl font-bold transition-colors", isDarkMode ? "text-white" : "text-zinc-900")}>Storyboard</h2>
                          
                          <button 
                            onClick={() => setIsEditMode(!isEditMode)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                              isEditMode 
                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                                : (isDarkMode ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200")
                            )}
                          >
                            {isEditMode ? <><Check size={14} /> Done</> : <><Edit2 size={14} /> Edit</>}
                          </button>

                          <button 
                            onClick={() => { setActiveTab('Nodes'); setActiveSceneId(null); }}
                            className={cn(
                              "flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                              isDarkMode ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                            )}
                          >
                            <Network size={14} /> Node Editor
                          </button>
                        </div>

                        <div className={cn(
                          "flex p-1 border rounded-xl transition-colors",
                          isDarkMode ? "bg-zinc-900 border-white/5" : "bg-white border-zinc-200 shadow-sm"
                        )}>
                          <button 
                            onClick={() => setViewMode('grid')}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              viewMode === 'grid' 
                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                                : (isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-600")
                            )}
                            title="Grid View"
                          >
                            <Grid size={16} />
                          </button>
                          <button 
                            onClick={() => setViewMode('list')}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              viewMode === 'list' 
                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                                : (isDarkMode ? "text-white/40 hover:text-white" : "text-zinc-400 hover:text-zinc-600")
                            )}
                            title="List View"
                          >
                            <List size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        {/* Space reduced */}
                      </div>

                      <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToWindowEdges]}
                      >
                        <SortableContext 
                          items={scenes.map(s => s.id)}
                          strategy={viewMode === 'grid' ? rectSortingStrategy : (viewMode === 'list' ? verticalListSortingStrategy : horizontalListSortingStrategy)}
                        >
                          <div className={cn(
                            "relative",
                            viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
                            viewMode === 'list' && "flex flex-col gap-4",
                            viewMode === 'timeline' && "flex flex-nowrap gap-4 overflow-x-auto pb-6 -mx-8 px-8 custom-scrollbar"
                          )}>
                            {scenes.map((scene, index) => (
                              <React.Fragment key={scene.id}>
                                <div className={cn(
                                  "relative group/scene",
                                  viewMode === 'timeline' && "flex-shrink-0"
                                )}>
                                  <SortableStoryboardCard 
                                    scene={scene} 
                                    onClick={() => handleSceneClick(scene)} 
                                    onUpdate={updateScene}
                                    isDarkMode={isDarkMode}
                                    isEditMode={isEditMode}
                                    onDuplicate={() => duplicateScene(scene.id)}
                                    onDelete={() => setDeleteConfirmId(scene.id)}
                                    viewMode={viewMode}
                                  />
                                  
                                  {isEditMode && index < scenes.length - 1 && (
                                    <div className={cn(
                                      "absolute z-30 flex items-center justify-center",
                                      viewMode === 'grid' && "-right-4 top-1/2 -translate-y-1/2 w-8 h-full",
                                      viewMode === 'list' && "left-1/2 -bottom-2 -translate-x-1/2 w-full h-4",
                                      viewMode === 'timeline' && "-right-2 top-1/2 -translate-y-1/2 w-4 h-full"
                                    )}>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); addSceneAtPosition(index + 1); }}
                                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xl bg-blue-500 text-white hover:bg-blue-600 hover:scale-110"
                                      >
                                        <Plus size={16} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </React.Fragment>
                            ))}
                            {isEditMode && (
                              <button 
                                onClick={() => addSceneAtPosition(scenes.length)}
                                className={cn(
                                  "border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all",
                                  viewMode === 'grid' && "min-h-[400px]",
                                  viewMode === 'list' && "h-24 flex-row",
                                  viewMode === 'timeline' && "w-64 flex-shrink-0",
                                  isDarkMode ? "border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60" : "border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-zinc-300 hover:text-zinc-500"
                                )}
                              >
                                <div className={cn(
                                  "rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500",
                                  viewMode === 'list' ? "w-8 h-8" : "w-12 h-12"
                                )}>
                                  <Plus size={viewMode === 'list' ? 16 : 24} />
                                </div>
                                <span className="text-sm font-bold">Add New Scene</span>
                              </button>
                            )}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>

                    <ConfirmationModal 
                      isOpen={!!deleteConfirmId}
                      onClose={() => setDeleteConfirmId(null)}
                      onConfirm={() => deleteConfirmId && deleteScene(deleteConfirmId)}
                      title="Delete Scene"
                      message="Are you sure you want to delete this scene? This action cannot be undone."
                      isDarkMode={isDarkMode}
                    />
                  </div>
                )}
                {activeTab === 'Budget' && <BudgetTab scenes={scenes} onUpdate={updateScene} isDarkMode={isDarkMode} />}
                {activeTab === 'Schedule' && <ScheduleTab scenes={scenes} onUpdate={updateScene} isDarkMode={isDarkMode} />}
                {activeTab === 'References' && <ReferencesTab scenes={scenes} onUpdate={updateScene} isDarkMode={isDarkMode} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
    </div>
  );
}
