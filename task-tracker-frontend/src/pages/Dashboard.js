import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [taskCategory, setTaskCategory] = useState("daily");

  // Load tasks from localStorage on first render
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage on update
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === "") return;

    const today = new Date().toISOString();
    setTasks([
      ...tasks,
      {
        name: newTask,
        completed: false,
        date: today,
        category: taskCategory,
      },
    ]);
    setNewTask("");
    setTaskCategory("daily");
  };

  const handleDeleteTask = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete the task?");
    if (!confirmDelete) return;
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleEditTask = (index) => {
    setNewTask(tasks[index].name);
    setEditIndex(index);
    setTaskCategory(tasks[index].category || "daily");
  };

  const handleUpdateTask = () => {
    if (newTask.trim() === "") return;
    const updated = [...tasks];
    updated[editIndex].name = newTask;
    updated[editIndex].category = taskCategory;
    setTasks(updated);
    setNewTask("");
    setEditIndex(null);
    setTaskCategory("daily");
  };

  const handleCheckboxToggle = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const pieData = [
    { name: "Completed", value: completedCount },
    { name: "Pending", value: pendingCount },
  ];

  const barData = [
    {
      name: "Tasks",
      Pending: pendingCount,
      Completed: completedCount,
    },
  ];

  const dailyTasks = tasks.filter((t) => t.category === "daily");
  const weeklyTasks = tasks.filter((t) => t.category === "weekly");
  const monthlyTasks = tasks.filter((t) => t.category === "monthly");
  const commonTasks = tasks.filter((t) => t.category === "common");

  const renderTaskTable = (title, taskList) => (
    <div className="bg-white rounded p-4 shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ul>
        {taskList.map((task, index) => (
          <li
            key={index}
            className="flex items-center justify-between mb-2 border-b pb-1"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleCheckboxToggle(tasks.indexOf(task))}
              />
              <span
                className={
                  task.completed ? "line-through text-gray-500" : "text-black"
                }
              >
                {task.name}
              </span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditTask(tasks.indexOf(task))}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(tasks.indexOf(task))}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📋 Task Tracker</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task"
              className="flex-1 border border-gray-300 rounded px-2 py-1"
            />
            <select
              value={taskCategory}
              onChange={(e) => setTaskCategory(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="common">Common</option>
            </select>
            {editIndex !== null ? (
              <button
                onClick={handleUpdateTask}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Update
              </button>
            ) : (
              <button
                onClick={handleAddTask}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            )}
          </div>

          {renderTaskTable("🟡 Common Tasks", commonTasks)}
          {renderTaskTable("🗓️ Daily Tasks", dailyTasks)}
          {renderTaskTable("📅 Weekly Tasks", weeklyTasks)}
          {renderTaskTable("📆 Monthly Tasks", monthlyTasks)}
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3 text-center">
              🥧 Task Status Pie Chart
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "Completed" ? "#00c853" : "#ff5252"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-3 text-center">
              📊 Task Status Bar Chart
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
                <Bar
                  dataKey="Pending"
                  fill="#ff5252"
                  radius={[10, 10, 0, 0]}
                  barSize={50}
                />
                <Bar
                  dataKey="Completed"
                  fill="#00c853"
                  radius={[10, 10, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;