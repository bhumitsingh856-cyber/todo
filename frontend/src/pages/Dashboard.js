import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get("/api/todos");
        setTodos(res.data);
      } catch (err) {
        console.error("Failed to fetch todos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const res = await axios.post("/api/todos", { title: newTodo });
      setTodos([res.data, ...todos]);
      setNewTodo("");
    } catch (err) {
      console.error("Failed to add todo", err);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const res = await axios.put(`/api/todos/${id}`, {
        completed: !completed,
      });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Failed to update todo", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete todo", err);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleEditSave = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(`/api/todos/${id}`, {
        title: editText.trim(),
      });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
      cancelEdit();
    } catch (err) {
      console.error("Failed to edit todo", err);
    }
  };

  const completed = todos.filter((t) => t.completed).length;
  const pending = todos.length - completed;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
        <div>
          <div className="header-brand">✅ TodoMaster</div>
          <p
            style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "2px" }}
          >
            Welcome back,{" "}
            <strong style={{ color: "#f1f5f9" }}>{user?.username}</strong> 👋
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="danger"
          style={{
            width: "auto",
            padding: "0.5rem 1.25rem",
            fontSize: "0.875rem",
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-chip">
          Total: <span>{todos.length}</span>
        </div>
        <div className="stat-chip">
          Pending: <span style={{ color: "#f59e0b" }}>{pending}</span>
        </div>
        <div className="stat-chip">
          Done: <span>{completed}</span>
        </div>
      </div>

      {/* Add todo */}
      <form
        onSubmit={handleAddTodo}
        className="add-todo-form glass-panel"
        style={{ padding: "1rem 1.25rem" }}
      >
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done? Press Enter to add…"
          style={{ flex: 1, margin: 0 }}
        />
        <button
          type="submit"
          style={{
            width: "auto",
            padding: "0.75rem 1.5rem",
            fontSize: "0.9rem",
          }}
        >
          + Add
        </button>
      </form>

      {/* List */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        {loading ? (
          <div className="empty-state">
            <div className="emoji">⏳</div>
            <p>Loading your tasks…</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🎉</div>
            <p
              style={{
                fontWeight: 600,
                color: "#f1f5f9",
                marginBottom: "0.25rem",
              }}
            >
              All clear!
            </p>
            <p>Add a task above to get started.</p>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo._id} className="todo-item">
                <div
                  className={`todo-content ${todo.completed ? "completed" : ""}`}
                >
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo._id, todo.completed)}
                    disabled={editingId === todo._id}
                  />
                  {editingId === todo._id ? (
                    <input
                      type="text"
                      className="todo-edit-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEditSave(todo._id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className="todo-title">{todo.title}</span>
                  )}
                </div>
                <div className="todo-actions">
                  {editingId === todo._id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(todo._id)}
                        className="save-btn"
                        title="Save"
                      >
                        ✔
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="cancel-btn"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(todo)}
                        className="edit-btn"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="delete-btn"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
