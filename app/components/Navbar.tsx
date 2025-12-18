"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white py-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-3">
        <Link href="/" className="text-xl font-semibold">
          EduTrack AI
        </Link>

        <div className="flex gap-6 text-lg">
          <Link href="/assignments" className="hover:text-gray-200">
            📚 Assignments
          </Link>
          <Link href="/dashboard" className="hover:text-gray-200">
            📊 Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
