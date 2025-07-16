import { useState } from "react";

import Reply from "../assets/comments-images/reply-sign.png";
import Cross from "../assets/comments-images/cross-sign.png";
import Delete from "../assets/comments-images/Delete.png";
import Edit from "../assets/comments-images/edit.png";

import "../index.css";

const CommentThread = ({ comment, handleAddComment }) => {
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const currentUserID = localStorage.getItem("user_id");

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleEdit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:3001/api/comments/${comment.comment_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUserID,
        content: editContent,
      }),
    });

    console.log(editContent);
    setIsEditing(false);
    //Optionally refresh comments from parent
     window.location.reload(); // or call parent's fetch comments
  };

  const handleDelete = async () => {
    await fetch(`http://localhost:3001/api/comments/${comment.comment_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUserID,
      }),
    });
    // Optionally refresh comments from parent
    window.location.reload(); // or call parent's fetch comments
  };

  return (
    <div style={{ marginLeft: comment.parent_id ? 20 : 0, marginTop: 10 }}>
      <div className="flex mb-5">
        {isEditing ? (
          <>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="border p-2 mr-2"
            />
            <button className="reply-button" onClick={handleEdit}>
              {" "}
              Save
            </button>
            <button
              className="reply-button"
              onClick={() => setIsEditing(false)}
            >
              Close
            </button>
          </>
        ) : (
          <div>
            <b>User {comment.user_id}</b>: {comment.content}
          </div>
        )}

        {isReplying ? (
          <img
            className="reply-img"
            src={Cross}
            onClick={() => setIsReplying(false)}
          />
        ) : (
          <img
            className="reply-img"
            src={Reply}
            onClick={() => setIsReplying(true)}
          />
        )}
        {String(comment.user_id) === String(currentUserID) && (
          <>
            <img
              src={Edit}
              className="reply-img"
              style={{ height: "15px", marginBottom: "6px" }}
              alt="Edit"
              onClick={() => setIsEditing(true)}
            />

            <img
              src={Delete}
              className="reply-img"
              style={{ height: "15px", marginBottom: "6px" }}
              alt="Delete"
              onClick={handleDelete}
            />
          </>
        )}
      </div>
      <hr />
      <div className="block">
        {isReplying && (
          <>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply..."
              className="border p-2 mr-2"
            />
            <button
              className="reply-button"
              onClick={() => {
                handleAddComment(comment.comment_id, reply);
                setReply("");
              }}
            >
              Reply
            </button>
          </>
        )}
        {comment.replies &&
          comment.replies.map((child) => (
            <CommentThread
              key={child.comment_id}
              comment={child}
              handleAddComment={handleAddComment}
            />
          ))}
      </div>
    </div>
  );
};

export default CommentThread;
