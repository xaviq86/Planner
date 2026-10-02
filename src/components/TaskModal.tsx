import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { db } from "../db";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded?: () => void;
}

export function TaskModal({ isOpen, onClose, onTaskAdded }: TaskModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setDueDate("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isClickOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;

    if (isClickOutside) {
      handleClose();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const today = new Date().toLocaleDateString("en-CA");

      await db.tasks.add({
        title: title.trim(),
        dueDate: dueDate || today,
        status: "todo",
        createdAt: new Date().toISOString(),
      });

      handleClose();
      onTaskAdded?.();
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      className="m-auto w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 lg:p-8 bg-white rounded-2xl shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm focus:outline-none"
    >
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-5 border-b border-gray-100">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Add New Task</h2>
        <button
          type="button"
          onClick={handleClose}
          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-2xl sm:text-3xl font-semibold text-gray-400 rounded-xl hover:text-gray-600 hover:bg-gray-100 transition"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <div>
          <label htmlFor="title" className="block mb-1.5 text-sm sm:text-base font-semibold text-gray-700">
            Task title
          </label>
          <input
            id="title"
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Prepare quarterly report..."
            className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block mb-1.5 text-sm sm:text-base font-semibold text-gray-700">
            Due date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-medium text-gray-700 transition bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base font-semibold text-white transition bg-blue-800 rounded-xl hover:bg-blue-700 active:scale-95 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Task"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
