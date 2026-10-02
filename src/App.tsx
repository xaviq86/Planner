import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { Header } from "./components/Header";
import { TaskCard } from "./components/TaskCard";
import { TaskModal } from "./components/TaskModal";
import { TaskFilters, type FilterType } from "./components/TaskFilters";
import { ListTodo } from "lucide-react";

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  const tasks = useLiveQuery(async () => {
    if (filter === "all") {
      return await db.tasks.reverse().toArray();
    }
    return await db.tasks.where("status").equals(filter).reverse().toArray();
  }, [filter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onAddTask={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <TaskFilters activeFilter={filter} onFilterChange={setFilter} />

        {tasks === undefined ? (
          <div className="text-center py-12 text-slate-400">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 lg:py-24 bg-white border border-dashed border-slate-300 rounded-3xl text-center px-4">
            <ListTodo className="w-12 h-12 lg:w-16 lg:h-16 text-slate-300 mb-4" />
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">
              No tasks found
            </h3>
            <p className="text-sm sm:text-base text-slate-500 mt-1 max-w-sm">
              {filter === "all"
                ? "Get started by creating your first task using the button above."
                : "No tasks match this filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-5">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
