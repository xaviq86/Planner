export type FilterType = "all" | "todo" | "in_progress" | "done";

interface TaskFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filterOptions: { label: string; value: FilterType }[] = [
  { label: "All Tasks", value: "all" },
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "done" },
];

export function TaskFilters({ activeFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="flex items-center gap-2 mb-6 lg:mb-8 overflow-x-auto pb-2">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onFilterChange(option.value)}
          className={`px-4 py-2 lg:px-5 lg:py-2.5 rounded-xl text-sm sm:text-base font-semibold transition ${
            activeFilter === option.value
              ? "bg-blue-800 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
