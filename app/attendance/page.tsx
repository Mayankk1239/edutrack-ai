"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AttendancePage() {
  const router = useRouter();

  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  // =============================================
  // AUTH + ROLE
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
  // LOAD ATTENDANCE
  // =============================================
  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/attendance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAttendance(data);
      setLoading(false);
    }

    load();
  }, []);

  // =============================================
  // CREATE ATTENDANCE (TEACHER ONLY)
  // =============================================
  async function addAttendance(e: any) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const studentId = e.target.studentId.value;
    const date = e.target.date.value;
    const status = e.target.status.value;

    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studentId, date, status }),
    });

    if (res.ok) {
      const newRecord = await res.json();
      setAttendance((prev) => [newRecord, ...prev]);
      e.target.reset();
    } else {
      alert("Failed to add record");
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

  if (loading) return <p className="mt-20 text-center text-xl">Loading…</p>;

  return (
    <div className="max-w-4xl mx-auto py-8">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">📋 Attendance</h1>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {/* ===================== TEACHER FORM ===================== */}
      {role === "teacher" && (
        <form
          onSubmit={addAttendance}
          className="mb-10 bg-gray-50 p-5 rounded shadow space-y-4"
        >
          <input
            name="studentId"
            placeholder="Student ID"
            required
            className="w-full p-3 border rounded"
          />

          <input
            type="date"
            name="date"
            required
            className="w-full p-3 border rounded"
          />

          <select
            name="status"
            required
            className="w-full p-3 border rounded"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded">
            ➕ Mark Attendance
          </button>
        </form>
      )}

      {/* ===================== TABLE ===================== */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Student ID</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-3 border">{a.studentId}</td>
                <td className="p-3 border">
                  {new Date(a.date).toLocaleDateString()}
                </td>
                <td
                  className={`p-3 border font-semibold ${
                    a.status === "present" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {a.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {attendance.length === 0 && (
        <p className="text-gray-500 text-center mt-6">No records found</p>
      )}
    </div>
  );
}
