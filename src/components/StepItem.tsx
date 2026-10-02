import { useState, type FormEvent, type KeyboardEvent } from "react";
import type { Step } from "../types";
import { CheckCircle2, Circle, Trash2, Pencil, Check, X } from "lucide-react";

interface StepItemProps {
  step: Step;
  onToggle: (step: Step) => void;
  onDelete: (stepId?: number) => void;
  onEdit: (stepId: number, newTitle: string) => void;
}

export function StepItem({ step, onToggle, onDelete, onEdit }: StepItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(step.title);

  const handleSave = (e?: FormEvent) => {
    e?.preventDefault();
    if (!title.trim() || step.id === undefined) return;

    if (title.trim() !== step.title) {
      onEdit(step.id, title.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(step.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className="flex items-center gap-2 bg-white px-3.5 py-2 lg:px-4 lg:py-2.5 rounded-xl border border-blue-800 shadow-sm"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 text-sm sm:text-base bg-transparent border-none outline-none text-slate-800"
        />
        <button
          type="submit"
          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
          title="Save step"
          aria-label="Save step"
        >
          <Check className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition"
          title="Cancel"
          aria-label="Cancel editing"
        >
          <X className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl border border-slate-200 shadow-sm group">
      <button
        type="button"
        role="checkbox"
        aria-checked={step.isCompleted}
        onClick={() => onToggle(step)}
        className="flex items-center gap-3 text-left flex-1 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded-lg"
      >
        {step.isCompleted ? (
          <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600 shrink-0" />
        ) : (
          <Circle className="w-5 h-5 lg:w-6 lg:h-6 text-slate-300 shrink-0" />
        )}
        <span
          className={`text-sm sm:text-base truncate ${
            step.isCompleted ? "line-through text-slate-400" : "text-slate-700"
          }`}
        >
          {step.title}
        </span>
      </button>

      <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-slate-400 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded-lg transition"
          title="Edit step"
          aria-label="Edit step"
        >
          <Pencil className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(step.id)}
          className="p-1.5 text-slate-400 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg transition"
          title="Delete step"
          aria-label="Delete step"
        >
          <Trash2 className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
        </button>
      </div>
    </div>
  );
}
