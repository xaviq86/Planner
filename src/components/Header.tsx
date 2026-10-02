import { Plus, CheckSquare } from "lucide-react";

interface HeaderProps {
  onAddTask: () => void;
}

export function Header({ onAddTask }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 lg:py-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 lg:w-13 lg:h-13 bg-blue-800 text-white rounded-2xl shadow-sm">
            <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 stroke-[2.5]" />
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
            Planner
          </h1>
        </div>

        <button
          type="button"
          onClick={onAddTask}
          className="flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 text-sm sm:text-base lg:text-lg font-semibold text-white transition bg-blue-800 rounded-xl hover:bg-blue-700 active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[2.5]" />
          <span>Add task</span>
        </button>
      </div>
    </header>
  );
}
