import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import ErrorBanner from "./components/ErrorBanner";
import Toast, { useToast } from "./components/Toast";
import { useTodos } from "./hooks/useTodos";
import "./App.css";

function App() {
  const {
    todos,
    loading,
    error,
    addTodo,
    editTodo,
    toggleDone,
    removeTodo,
    clearError,
  } = useTodos();
  const { toasts, addToast, dismissToast } = useToast();

  const handleAdd = async (data) => {
    await addTodo(data);
    addToast("Task created successfully!", "success");
  };

  const handleEdit = async (id, data) => {
    await editTodo(id, data);
    addToast("Task updated successfully!", "success");
  };

  const handleDelete = async (id) => {
    await removeTodo(id);
    addToast("Task deleted", "success");
  };

  return (
    <div className="app">
      <div className="background-effects">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      <div className="container">
        <header className="app-header" id="app-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h1>TaskFlow</h1>
          </div>
          <p className="subtitle">
            Organize your day, one task at a time
            {!loading && todos.length > 0 && (
              <span className="header-count">
                {" · "}{todos.filter(t => t.done).length}/{todos.length} done
              </span>
            )}
          </p>
        </header>

        <ErrorBanner message={error} onDismiss={clearError} />

        <main className="main-content">
          <TodoForm onAdd={handleAdd} />
          <TodoList
            todos={todos}
            onToggle={toggleDone}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </main>

        <footer className="app-footer" id="app-footer">
          <p>Built with React & Express · TaskFlow</p>
        </footer>
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
