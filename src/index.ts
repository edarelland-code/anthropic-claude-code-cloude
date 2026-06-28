import { addTask, listTasks, completeTask, deleteTask, searchTasks } from "./taskStore";

const [, , command, ...args] = process.argv;

switch (command) {
  case "add": {
    const [title, priority] = args;
    if (!title) {
      console.error("Usage: task-manager add <title> [priority]");
      process.exit(1);
    }
    const task = addTask(title, (priority as any) ?? "medium");
    console.log(`Added task #${task.id}: ${task.title}`);
    break;
  }
  case "list": {
    const tasks = listTasks();
    if (tasks.length === 0) {
      console.log("No tasks.");
    } else {
      for (const t of tasks) {
        const status = t.done ? "[x]" : "[ ]";
        console.log(`${status} #${t.id} [${t.priority}] ${t.title}`);
      }
    }
    break;
  }
  case "done": {
    const task = completeTask(args[0]);
    if (task) {
      console.log(`Completed: ${task.title}`);
    } else {
      console.error(`Task #${args[0]} not found.`);
    }
    break;
  }
  case "delete": {
    const ok = deleteTask(args[0]);
    console.log(ok ? "Deleted." : "Not found.");
    break;
  }
  case "search": {
    const results = searchTasks(args.join(" "));
    results.forEach((t) => console.log(`#${t.id} ${t.title}`));
    break;
  }
  default:
    console.log("Commands: add | list | done | delete | search");
}
