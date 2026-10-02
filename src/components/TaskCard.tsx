import { useState, type FormEvent } from "react";
import type { Task, Step } from "../types";
import { db } from "../db";
import { useLiveQuery } from "dexie-react-hooks";
import { StepItem } from "./StepItem";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Pencil,
  Check,
  X,
} from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDueDate, setEditDueDate] = useState(task.dueDate);

  const steps = useLiveQuery(async () => {
    if (task.id === undefined) return [];
    return await db.steps.where("taskId").equals(task.id).toArray();
  }, [task.id]);

  const totalSteps = steps?.length || 0;
  const completedSteps = steps?.filter((s) => s.isCompleted)?.length || 0;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const updateTaskStatusBasedOnSteps = async (completedCount: number, totalCount: number) => {
    if (task.id === undefined || totalCount === 0) return;

    let newStatus: Task["status"] = task.status;
    if (completedCount === totalCount) {
      newStatus = "done";
    } else if (completedCount > 0) {
      newStatus = "in_progress";
    } else {
      newStatus = "todo";
    }

    if (newStatus !== task.status) {
      await db.tasks.update(task.id, { status: newStatus });
    }
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || task.id === undefined) return;

    await db.tasks.update(task.id, {
      title: editTitle.trim(),
      dueDate: editDueDate,
    });

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate);
  };

  const handleAddStep = async (e: FormEvent) => {
    e.preventDefault();
    if (!newStepTitle.trim() || task.id === undefined) return;

    await db.steps.add({
      taskId: task.id,
      title: newStepTitle.trim(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    });

    setNewStepTitle("");
    await updateTaskStatusBasedOnSteps(completedSteps, totalSteps + 1);
  };

  const toggleStep = async (step: Step) => {
    if (step.id === undefined) return;

    const nextCompletedState = !step.isCompleted;
    await db.steps.update(step.id, {
      isCompleted: nextCompletedState,
    });

    const newCompletedCount = nextCompletedState ? completedSteps + 1 : completedSteps - 1;
    await updateTaskStatusBasedOnSteps(newCompletedCount, totalSteps);
  };

  const editStep = async (stepId: number, newTitle: string) => {
    await db.steps.update(stepId, {
      title: newTitle,
    });
  };

  const deleteStep = async (stepId?: number) => {
    if (stepId === undefined) return;

    const targetStep = steps?.find((s) => s.id === stepId);
    await db.steps.delete(stepId);

    const newTotal = totalSteps - 1;
    const newCompleted = targetStep?.isCompleted ? completedSteps - 1 : completedSteps;
    await updateTaskStatusBasedOnSteps(newCompleted, newTotal);
  };

  const deleteTask = async () => {
    if (task.id === undefined) return;
    if (!confirm(`Are you sure you want to delete the task: "${task.title}"?`)) return;

    await db.transaction("rw", db.tasks, db.steps, async () => {
      await db.steps.where("taskId").equals(task.id!).delete();
      await db.tasks.delete(task.id!);
    });
  };

  const renderStatusBadge = (status: Task["status"]) => {
    const baseClasses = "px-3 py-1 text-xs sm:text-sm font-medium rounded-full";
    switch (status) {
      case "todo":
        return <span className={`${baseClasses} bg-slate-100 text-slate-700`}>To Do</span>;
      case "in_progress":
        return <span className={`${baseClasses} bg-blue-50 text-blue-800 border border-blue-200`}>In Progress</span>;
      case "done":
        return <span className={`${baseClasses} bg-emerald-100 text-emerald-700`}>Completed</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-4 sm:p-5 lg:p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm sm:text-base lg:text-lg border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="px-3 py-1.5 text-xs sm:text-sm lg:text-base border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-600"
                  />
                  <button
                    type="submit"
                    className="p-1.5 lg:p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                    title="Save"
                    aria-label="Save changes"
                  >
                    <Check className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="p-1.5 lg:p-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition"
                    title="Cancel"
                    aria-label="Cancel editing"
                  >
                    <X className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className={`font-bold text-slate-900 text-base sm:text-lg lg:text-xl truncate ${progressPercent === 100 ? "line-through text-slate-400" : ""}`}>
                  {task.title}
                </h3>

                <div className="flex items-center gap-3 sm:gap-4 mt-1.5 text-xs sm:text-sm lg:text-base text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-blue-800" />
                    {task.dueDate}
                  </span>
                  <span>•</span>
                  <span>{completedSteps}/{totalSteps} steps</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          {!isEditing && renderStatusBadge(task.status)}

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 lg:p-2.5 text-slate-400 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition"
              title="Edit task"
              aria-label="Edit task"
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5" />
            </button>
          )}

          <button
            onClick={deleteTask}
            className="p-2 lg:p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse steps" : "Expand steps"}
            className="p-2 lg:p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition flex items-center gap-1 text-sm font-medium"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5 lg:w-6 lg:h-6" /> : <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6" />}
          </button>
        </div>
      </div>

      <div className="w-full bg-slate-100 h-2 lg:h-2.5">
        <div
          className="bg-blue-800 h-full transition-all duration-300 rounded-r-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5 lg:p-6 bg-slate-50 border-t border-slate-100 space-y-4">
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">Action Steps</h4>

          <div className="space-y-2.5">
            {steps?.length === 0 && (
              <p className="text-sm sm:text-base text-slate-400 italic">No steps yet. Add the first one below.</p>
            )}

            {steps?.map((step) => (
              <StepItem
                key={step.id}
                step={step}
                onToggle={toggleStep}
                onDelete={deleteStep}
                onEdit={editStep}
              />
            ))}
          </div>

          <form onSubmit={handleAddStep} className="flex gap-2 sm:gap-3 pt-2">
            <input
              type="text"
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              placeholder="Add a new step..."
              className="flex-1 px-3.5 py-2 sm:px-4 sm:py-2.5 lg:py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-blue-800 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-xl transition flex items-center gap-1.5 shrink-0 active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
