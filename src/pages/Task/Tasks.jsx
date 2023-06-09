import React, { useState, useEffect } from "react";
import { ref, push, onValue, remove, update } from "firebase/database";
import useAuth from "../../hooks/useAuth";
import { db } from "../../firebase/firebase.config.js";
import { FaExternalLinkAlt, FaPen, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Tasks = () => {
  const { user } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState([]);
  const [loggedUserData, setLoggedUserData] = useState({});
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [createdBy, setCreatedBy] = useState(user?.email);
  const [userName, setUserName] = useState(user?.displayName);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [dueDateFilter, setDueDateFilter] = useState("");

  const isAdmin = loggedUserData.admin || false;
  const navigate = useNavigate();

  // * Read Tasks
  useEffect(() => {
    const tasksRef = ref(db, "tasks");
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskList = Object.keys(data).map((taskId) => ({
          id: taskId,
          ...data[taskId],
        }));
        setTasks(taskList);
        applyFilters(taskList);
      } else {
        setTasks([]);
        setFilteredTasks([]);
      }
    });
  }, [showCompleted, dueDateFilter]);

  // * Read User
  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const usersArray = Object.keys(usersData).map((userId) => ({
        id: userId,
        admin: usersData[userId].admin,
        email: usersData[userId].email,
        name: usersData[userId].name,
        photoUrl: usersData[userId].photoUrl,
      }));
      setFirebaseUser(usersArray);
      const currentUser = usersArray.find(
        (fbUser) => fbUser.email === user.email
      );
      if (currentUser) {
        setLoggedUserData(currentUser);
      }
    });
  }, []);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You Must fill the required fields",
      });
      return;
    }
    const tasksRef = ref(db, "tasks");

    const newTask = {
      title: title,
      description: description,
      dueDate: dueDate,
      createdBy: createdBy,
      userName: userName,
      comments: [],
      edited: false,
      completed: false,
      assignByAdmin: isAdmin,
    };

    push(tasksRef, newTask)
      .then(() => {
        console.log("Task created successfully");
        setTitle("");
        setDescription("");
        setDueDate("");
      })
      .catch((error) => {
        console.error("Error creating task: ", error);
      });
  };

  const handleDeleteTask = (taskId) => {
    const taskRef = ref(db, `tasks/${taskId}`);
    remove(taskRef)
      .then(() => {
        console.log("Task deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting task: ", error);
      });
  };

  const handleEditTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setSelectedTask(task);
    setIsEdited(true);
  };

  const handleCloseUpdate = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setSelectedTask("");
    setIsEdited(false);
  };

  const handleUpdateTask = () => {
    const taskRef = ref(db, `tasks/${selectedTask.id}`);

    const updatedTask = {
      title: title,
      description: description,
      dueDate: dueDate,
      createdBy: selectedTask.createdBy,
      edited: true,
      completed: completed,
    };

    update(taskRef, updatedTask)
      .then(() => {
        console.log("Task updated successfully");
        setTitle("");
        setDescription("");
        setDueDate("");
        setSelectedTask(null);
        setIsEdited(false);
      })
      .catch((error) => {
        console.error("Error updating task: ", error);
      });
  };

  const handleFilterCompleted = () => {
    setShowCompleted(!showCompleted);
    applyFilters(tasks);
  };

  const handleFilterDueDate = (e) => {
    setDueDateFilter(e.target.value);
    applyFilters(tasks);
  };

  const applyFilters = (taskList) => {
    let filteredList = taskList;

    if (showCompleted) {
      filteredList = filteredList.filter((task) => !task.completed === false);
    }

    if (dueDateFilter !== "") {
      filteredList = filteredList.filter(
        (task) => task.dueDate === dueDateFilter
      );
    }

    setFilteredTasks(filteredList);
  };

  const handleCompletedTaskChange = (e) => {
    setCompleted(e.target.value);
  };

  const handleTaskCreatedBy = (e) => {
    setCreatedBy(e.target.value);
    const assignUser = firebaseUser.find(
      (fbUser) => fbUser.email === createdBy
    );
    console.log("assignUser", assignUser);
    setUserName(assignUser.name);
  };

  const handleTaskDetails = (taskID) => {
    navigate(`/task/${taskID}`);
  };

  return (
    <>
      <section className="section section-login">
        <div className="container px-10">
          <h2 className="mb-5 text-xl">Create Task</h2>

          <form className="mb-16">
            <div className="mb-8">
              <label className="block text-gray-700">Title:</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input mt-1 block w-full rounded-md shadow-sm"
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-700">Description:</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea mt-1 block w-full rounded-md shadow-sm"
              ></textarea>
            </div>
            <div className="mb-8">
              <label className="block text-gray-700">Due Date:</label>
              <input
                required
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input mt-1 block w-full rounded-md shadow-sm"
              />
            </div>
            {loggedUserData.admin && (
              <div className="mb-8">
                <label className="block text-gray-700">Assigning Tasks</label>
                <select
                  required
                  value={createdBy}
                  onChange={handleTaskCreatedBy}
                  className="form-select form-input mt-1 block w-full rounded-md shadow-sm"
                >
                  {firebaseUser.map((user) => (
                    <option key={user.id} value={user.email}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {isEdited ? (
              <>
                <div className="mb-8">
                  <label className="block text-gray-700">Task Completed!</label>
                  <select
                    required
                    className="form-select form-input mt-1 block w-full rounded-md shadow-sm"
                    value={completed}
                    onChange={handleCompletedTaskChange}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </>
            ) : (
              ""
            )}

            {isEdited ? (
              <>
                <button
                  type="button"
                  onClick={handleUpdateTask}
                  className="btn btn-indigo"
                >
                  Update Task
                </button>
                <button
                  type="button"
                  onClick={handleCloseUpdate}
                  className="btn btn-indigo ml-3"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCreateTask}
                  className="btn btn-indigo"
                >
                  Create Task
                </button>
              </>
            )}
          </form>

          {/* By Completed */}
          <div className="flex items-center mb-5">
            <label className="mr-2">Show Completed:</label>
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={handleFilterCompleted}
            />
          </div>

          {/* By Due Date */}
          <div className="flex items-center mb-5">
            <label className="mr-2">Due Date:</label>
            <select className="form-select" onChange={handleFilterDueDate}>
              <option value="">All</option>
              {tasks.map((task, index) => (
                <option key={index} value={task.dueDate}>
                  {task.dueDate}
                </option>
              ))}
            </select>
          </div>

          <h2>Task List</h2>
          <div className="overflow-x-auto mb-10">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Created By</th>
                  <th>Assign To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>
                      {task?.title}
                      {task?.edited ? (
                        <>
                          <span className="badge badge-accent badge-outline ml-3 text-[8px]">
                            Edited
                          </span>
                        </>
                      ) : (
                        ""
                      )}
                      {task.completed ? (
                        <>
                          <span className="badge badge-success badge-outline ml-3 text-[8px]">
                            Completed
                          </span>
                        </>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>{task?.description}</td>
                    <td>{task?.dueDate}</td>
                    <td>
                      {task.assignByAdmin ? (
                        <>
                          <span className="badge badge-primary text-[12px]">
                            Admin
                          </span>
                        </>
                      ) : (
                        task?.userName
                      )}
                    </td>
                    <td>{task?.createdBy}</td>
                    <td>
                      <button
                        title="Edit Task"
                        onClick={() => handleEditTask(task)}
                        className="btn btn-sm btn-blue mb-1"
                        disabled={
                          (user.email !== task.createdBy &&
                            !loggedUserData.admin) ||
                          (task.createdBy === "admin" && !loggedUserData.admin)
                        }
                      >
                        <FaPen />
                      </button>
                      <button
                        title="Delete Task"
                        onClick={() => handleDeleteTask(task.id)}
                        className="btn btn-sm btn-blue mb-1 ml-2"
                        disabled={
                          (user.email !== task.createdBy &&
                            !loggedUserData.admin) ||
                          (task.createdBy === "admin" && !loggedUserData.admin)
                        }
                      >
                        <FaTrash />
                      </button>

                      <button
                        onClick={() => handleTaskDetails(task.id)}
                        title="Comment"
                        className="btn btn-sm btn-blue mb-1 ml-2"
                      >
                        <FaExternalLinkAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tasks;
