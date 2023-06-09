import React, { useState, useEffect } from "react";
import { ref, push, onValue, remove } from "firebase/database";
import useAuth from "../../hooks/useAuth";
import { db } from "../../firebase/firebase.config";

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  console.log(tasks);

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
      } else {
        setTasks([]);
      }
    });
  }, []);

  const handleCreateTask = () => {
    const tasksRef = ref(db, "tasks");

    const newTask = {
      title: title,
      description: description,
      dueDate: dueDate,
      createdBy: user.email,
      edited: false,
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

  return (
    <>
      <section className="section section-login">
        <div className="container px-10">
          <h2 className="mb-5 text-xl">Create Task</h2>

          <form className="mb-16">
            <div className="mb-4">
              <label className="block text-gray-700">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input mt-1 block w-full rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea mt-1 block w-full rounded-md shadow-sm"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Due Date:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input mt-1 block w-full rounded-md shadow-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleCreateTask}
              className="btn btn-indigo"
            >
              Create Task
            </button>
          </form>

          <h2>Task List</h2>
          <div className="overflow-x-auto mb-10">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.dueDate}</td>
                    <td>{task.createdBy}</td>
                    <td>
                      <button className="btn btn-sm btn-blue">Edit</button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="btn btn-sm btn-red ml-3"
                      >
                        Delete
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
