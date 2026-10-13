export type TaskStatus = "Not Started" | "Working on it" | "Done" | "Stuck" | "Review" | "Blocked";
export type TaskPriority = "Low" | "Medium" | "High";

export type Task = {
  id: number;
  name: string;
  owner: string;
  ownerName: string;
  status: TaskStatus;
  priority: TaskPriority;
  due: string;
  group: string;
};

export const initialTasks: Task[] = [
  { id: 1, name: "New task", owner: "", ownerName: "Unassigned", status: "Not Started", priority: "Medium", due: "", group: "To-Do" },
  { id: 2, name: "New task", owner: "", ownerName: "Unassigned", status: "Not Started", priority: "Medium", due: "", group: "To-Do" },
  { id: 3, name: "New task", owner: "", ownerName: "Unassigned", status: "Not Started", priority: "Medium", due: "", group: "To-Do" },
  { id: 4, name: "Task 1", owner: "MC", ownerName: "Mara Cruz", status: "Working on it", priority: "High", due: "Aug 18", group: "To-Do" },
  { id: 5, name: "Task 2", owner: "", ownerName: "Unassigned", status: "Done", priority: "Low", due: "Aug 19", group: "To-Do" },
  { id: 6, name: "Task 3", owner: "", ownerName: "Unassigned", status: "Stuck", priority: "High", due: "Aug 20", group: "To-Do" },
];
