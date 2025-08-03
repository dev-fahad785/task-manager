import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import LoaderScreen from "../components/Loader";
import { Link } from "react-router-dom";
const AddTodo = () => {
  const { state } = useLocation(); // Get todo from route
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || null;
  console.log(user);
  const userID = user.id;

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleClose = () => {
    setStatus("idle");
    setErrorMsg("");
  };

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    estTime: "",
    priority: "Low",
    dueDate: "",
  });

  // If state.todo exists, it's edit mode
  useEffect(() => {
    if (state?.todo) {
      setNewTask(state.todo);
    }
  }, [state]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [id]: id === "dueDate" ? new Date(value).toISOString() : value,
    }));
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000; // in ms
    const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const token = localStorage.getItem("token");
  // token.split()
  console.log(token);
  const handleSubmit = async (e) => {
    setStatus("loading");
    e.preventDefault();

    if (!newTask.title.trim()) {
      setStatus("error");
      setErrorMsg("Title is required");
      return;
    }

    try {
      if (state?.todo) {
        // EDIT existing task
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/task/updateTask`,
          {
            taskID: state.todo._id,
            updatedTask: newTask,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setSuccessMsg("Task updated successfully");
          setStatus("success");
          navigate("/dashboard");
        }
      } else {
        // ADD new task
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/task/addTask`,
          {
            userID,
            newTask,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setStatus("success");
          setSuccessMsg("Task Added Successfully");
          setNewTask({
            title: "",
            description: "",
            estTime: "",
            priority: "Low",
            dueDate: "",
          });
          console.log(newTask);
          // window.location.reload();
        } else {
          setStatus("error");
          setErrorMsg("Can't add task, server returned: " + response.status);
        }
      }
    } catch (error) {
      setStatus("error");
      setErrorMsg(error.message || "Unknown error");
    }
  };

  return (
<div className="border border-gray-700 flex items-center justify-center px-4">
  <LoaderScreen
    status={status}
    errorMessage={errorMsg}
    onClose={handleClose}
    successMessage={successMsg}
  />

  <div className="w-full max-w-2xl bg-white/60 backdrop-blur-md shadow-xl rounded-2xl p-8 md:p-10 transition-all duration-300">
    {/* Back Button + Heading */}
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <Link
        to="/"
        className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-indigo-500 hover:text-white transition"
      >
        ← Back
      </Link>

      <h1 className="text-3xl font-bold text-indigo-700 text-center md:flex-1">
        {state?.todo ? "Edit Task" : "Add New Task"}
      </h1>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-gray-800 font-medium mb-1"
        >
          Task Title
        </label>
        <input
          id="title"
          type="text"
          value={newTask.title}
          onChange={handleInputChange}
          placeholder="e.g. Finish React project"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-gray-800 font-medium mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          rows="3"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="Details about the task..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="estTime"
            className="block text-gray-800 font-medium mb-1"
          >
            Est. Time (minutes)
          </label>
          <input
            id="estTime"
            type="number"
            value={newTask.estTime}
            onChange={handleInputChange}
            placeholder="e.g. 45"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-gray-800 font-medium mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            value={newTask.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-gray-800 font-medium mb-1"
        >
          Due Date
        </label>
        <input
          id="dueDate"
          type="datetime-local"
          value={formatDateForInput(newTask.dueDate)}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 010 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 010-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        {state?.todo ? "Update Task" : "Add Task"}
      </button>
    </form>
  </div>
</div>

  );
};

export default AddTodo;
