"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AssignmentsPage() {
  const router = useRouter();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState<any | null>(null);

  // =============================================
  // AUTH CHECK + ROLE LOAD
  // =============================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    setRole(storedRole || "");
  }, [router]);

  // =============================================
  // LOAD ASSIGNMENTS — GET API
  // =============================================
  useEffect(() => {
    async function loadAssignments() {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setAssignments(data);
      setLoading(false);
    }

    loadAssignments();
  }, []);

  // =============================================
  // DELETE — TEACHER ONLY
  // =============================================
  async function deleteAssignment(id: number) {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/assignments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    }
  }

  // =============================================
  // LOGOUT
  // =============================================
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  }

  if (loading) {
    return <p className="mt-20 text-center text-xl">Loading…</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">📚 Assignments</h1>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {/* ===================== CREATE FORM — TEACHER ONLY ===================== */}
      {role === "teacher" && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const form = e.target as HTMLFormElement;
            const token = localStorage.getItem("token");

            const title = (form.elements.namedItem("title") as HTMLInputElement).value;
            const description = (form.elements.namedItem("description") as HTMLInputElement).value;
            const dueDate = (form.elements.namedItem("dueDate") as HTMLInputElement).value;

            const res = await fetch("/api/assignments", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ title, description, dueDate }),
            });

            const newAssignment = await res.json();
            setAssignments((prev) => [newAssignment, ...prev]);
            form.reset();
          }}
          className="mb-10 space-y-4 bg-gray-50 p-5 rounded-lg shadow"
        >
          <input
            name="title"
            placeholder="Title"
            required
            className="w-full p-3 border rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            required
            className="w-full p-3 border rounded"
          />

          <input
            type="date"
            name="dueDate"
            required
            className="w-full p-3 border rounded"
          />

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded">
            ➕ Add Assignment
          </button>
        </form>
      )}

      {/* ===================== LIST ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {assignments.map((a) => (
          <div
            key={a.id}
            className="p-5 bg-white shadow rounded border"
          >
            <h2 className="font-semibold">{a.title}</h2>

            <p className="mt-2 text-gray-600">
              {a.description}
            </p>

            <p className="text-sm mt-3 text-gray-500">
              📅 {new Date(a.dueDate).toLocaleDateString()}
            </p>

            {/* DELETE BUTTON — TEACHER ONLY */}
            {role === "teacher" && (
              <button
                onClick={() => deleteAssignment(a.id)}
                className="mt-3 text-red-600 hover:text-red-900 text-sm"
              >
                ❌ Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
