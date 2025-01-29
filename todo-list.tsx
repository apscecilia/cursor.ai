"use client"

import { useState } from "react"
import { PlusCircle, Trash2, CheckCircle, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Header from "./header"
import Footer from "./footer"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
      setNewTodo("")
    }
  }

  const updateTodo = (id: number, newText: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo)))
    setEditingId(null)
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Todo List</h2>
          <div className="flex mb-4">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
              className="flex-grow mr-2"
            />
            <Button onClick={addTodo}>
              <PlusCircle className="w-5 h-5" />
            </Button>
          </div>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center bg-gray-100 p-2 rounded">
                {editingId === todo.id ? (
                  <Input
                    type="text"
                    value={todo.text}
                    onChange={(e) => updateTodo(todo.id, e.target.value)}
                    className="flex-grow mr-2"
                    onBlur={() => setEditingId(null)}
                    autoFocus
                  />
                ) : (
                  <span
                    className={`flex-grow cursor-pointer ${todo.completed ? "line-through text-gray-500" : ""}`}
                    onClick={() => setEditingId(todo.id)}
                  >
                    {todo.text}
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={() => toggleTodo(todo.id)}>
                  {todo.completed ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteTodo(todo.id)}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}

