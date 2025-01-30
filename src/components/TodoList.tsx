import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Pencil, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Header from "./Header"
import Footer from "./Footer"
import { Todo } from "@/types/todo"
import { db } from "@/lib/firebase"
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore"

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      } as Todo))
      setTodos(todosData)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      try {
        await addDoc(collection(db, "todos"), {
          text: newTodo.trim(),
          completed: false,
          createdAt: Date.now()
        })
        setNewTodo("")
      } catch (error) {
        console.error("Error adding todo:", error)
      }
    }
  }

  const updateTodo = async (id: string, newText: string) => {
    try {
      const todoRef = doc(db, "todos", id)
      await updateDoc(todoRef, { text: newText })
      setEditingId(null)
    } catch (error) {
      console.error("Error updating todo:", error)
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const todoRef = doc(db, "todos", id)
      await updateDoc(todoRef, { completed: !completed })
    } catch (error) {
      console.error("Error toggling todo:", error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "todos", id))
    } catch (error) {
      console.error("Error deleting todo:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Todo List</h2>
          <form onSubmit={addTodo} className="flex mb-4">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
              className="flex-grow mr-2"
            />
            <Button type="submit">
              <PlusCircle className="w-5 h-5" />
            </Button>
          </form>

          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                    className="h-4 w-4"
                  />
                  {editingId === todo.id ? (
                    <div className="flex flex-grow gap-2">
                      <Input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-grow"
                      />
                      <Button
                        size="sm"
                        onClick={() => updateTodo(todo.id, editText)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`flex-grow ${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(todo.id)
                          setEditText(todo.text)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 