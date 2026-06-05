import { useState } from "react";

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!title.trim()) {
      setValidationError("Title is required");
      return;
    }
    if (title.trim().length > 200) {
      setValidationError("Title cannot exceed 200 characters");
      return;
    }

    setValidationError("");
    setSubmitting(true);

    try {
      await onAdd({
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
    } catch (err) {
      setValidationError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit} id="todo-form">
      <div className="form-header">
        <div className="form-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </div>
        <h2>Add New Task</h2>
      </div>

      {validationError && (
        <div className="form-error" id="form-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {validationError}
        </div>
      )}

      <div className="form-fields">
        <div className="input-group">
          <label htmlFor="todo-title">Title *</label>
          <input
            id="todo-title"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError("");
            }}
            maxLength={200}
            disabled={submitting}
            autoComplete="off"
          />
          <span className="char-count">{title.length}/200</span>
        </div>

        <div className="input-group">
          <label htmlFor="todo-description">Description</label>
          <textarea
            id="todo-description"
            placeholder="Add more details... (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={3}
            disabled={submitting}
          />
          <span className="char-count">{description.length}/1000</span>
        </div>
      </div>

      <button
        type="submit"
        className="btn-add"
        id="btn-add-todo"
        disabled={submitting || !title.trim()}
      >
        {submitting ? (
          <>
            <span className="spinner" />
            Adding...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Task
          </>
        )}
      </button>
    </form>
  );
}
