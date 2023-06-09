import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, push } from "firebase/database";
import { db } from "../../firebase/firebase.config";
import useAuth from "../../hooks/useAuth";

const TaskDetails = () => {
  const { id: taskID } = useParams();
  const { user } = useAuth();

  const [task, setTask] = useState({});
  const [comment, setComment] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const userEmail = user.email;
    setUserEmail(userEmail);

    const taskRef = ref(db, `tasks/${taskID}`);
    onValue(taskRef, (snapshot) => {
      const taskData = snapshot.val();
      if (taskData) {
        setTask({ id: taskID, ...taskData });
      } else {
        setTask(null);
      }
    });
  }, [taskID]);

  if (!task) {
    return <div>Loading...</div>;
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();

    if (comment.trim() === "") {
      return;
    }

    const newComment = {
      user: userEmail,
      text: comment,
    };

    push(ref(db, `tasks/${taskID}/comments`), newComment)
      .then(() => {
        console.log("Comment added successfully!");
        setComment("");
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  return (
    <>
      <section className="section section-task-details">
        <div className="container px-10 mx-auto p-6 space-y-8">
          <h2 className="text-2xl font-bold mb-4">{task?.title}</h2>
          <div className="mb-4">
            <span className="font-bold">Description: </span>
            <span>{task?.description}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Due Date: </span>
            <span>{task?.dueDate}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Created By: </span>
            <span>{task?.userName}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Assign To: </span>
            <span>{task?.createdBy}</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Comments</h3>
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            {Object.keys(task?.comments || {}).length > 0 ? (
              <ul>
                {Object.keys(task?.comments).map((commentKey) => {
                  const comment = task.comments[commentKey];
                  return (
                    <li key={commentKey} className="mb-2">
                      <span className="font-bold">{comment.user}: </span>
                      <span>{comment.text}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
          <form onSubmit={handleSubmitComment}>
            <label className="font-bold">Add Comment:</label>
            <div className="flex flex-col">
              <textarea
                rows={7}
                value={comment}
                onChange={handleCommentChange}
                className="flex-grow form-input mt-1 rounded-md shadow-sm border-[1px] border-gray-400"
              />
              <button
                type="submit"
                className="w-[10%] mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default TaskDetails;
