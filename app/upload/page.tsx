"use client";
import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleExtract() {
    if (!file) return alert("Please select an image first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/ocr", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setText(result.text || "No text found");
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10 bg-gradient-to-br from-black via-gray-900 to-black text-white">

      <h1 className="text-4xl font-bold mb-8">📸 Extract from Image</h1>

      <input
        type="file"
        accept="image/*"
        className="mb-4"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleExtract}
        className="bg-blue-600 px-8 py-3 rounded-lg mt-4"
      >
        {loading ? "Extracting..." : "Extract Text"}
      </button>

      {text && (
        <>
          <textarea
            className="w-full max-w-3xl h-32 bg-white text-black rounded-lg p-4 mt-6"
            value={text}
            readOnly
          />
          <a
            href="/home"
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Analyze Extracted Text →
          </a>
        </>
      )}
    </main>
  );
}
