import { addTask, listTasks, _reset } from "./taskStore";

beforeEach(() => _reset());

describe("listTasks sorting", () => {
  it("returns tasks sorted high → medium → low", () => {
    addTask("Low priority task", "low");
    addTask("High priority task", "high");
    addTask("Medium priority task", "medium");

    const titles = listTasks().map((t) => t.priority);
    expect(titles).toEqual(["high", "medium", "low"]);
  });

  it("breaks ties by createdAt (oldest first)", () => {
    const a = addTask("First high", "high");
    const b = addTask("Second high", "high");

    const ids = listTasks().map((t) => t.id);
    expect(ids[0]).toBe(a.id);
    expect(ids[1]).toBe(b.id);
  });

  it("filter by priority still returns sorted results", () => {
    addTask("A", "medium");
    addTask("B", "high");
    addTask("C", "medium");

    const titles = listTasks({ priority: "medium" }).map((t) => t.title);
    expect(titles).toEqual(["A", "C"]);
  });
});
