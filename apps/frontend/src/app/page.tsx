"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";
import { UploadCloud, FolderOpen, Compass, Film, BookOpen, Layers, PlayCircle } from "lucide-react";

interface MangaCatalogItem {
  id: string;
  title: string;
  chaptersCount: number;
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mangaTitle, setMangaTitle] = useState("");
  const [chapterNum, setChapterNum] = useState("1");
  const [uploadStatus, setUploadStatus] = useState("");

  // Get uploaded manga list
  const { data: mangas, isLoading } = useQuery<MangaCatalogItem[]>({
    queryKey: ["mangas"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/manga");
        return res.data?.data || [];
      } catch (err) {
        // Return fallback dummy data for presentation if backend is not running
        return [
          { id: "1", title: "One Punch Man", chaptersCount: 1 },
          { id: "2", title: "Chainsaw Man", chaptersCount: 3 },
          { id: "3", title: "My Hero Academia", chaptersCount: 2 }
        ];
      }
    }
  });

  // Handle Drag & Drop actions
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      if (!mangaTitle) {
        // Pre-fill manga title using filename base
        const cleanName = e.dataTransfer.files[0].name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        setMangaTitle(cleanName);
      }
    }
  };

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.post("/manga/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      setUploadStatus("Success! Chapter queued for story extraction.");
      setSelectedFile(null);
      setMangaTitle("");
      queryClient.invalidateQueries({ queryKey: ["mangas"] });
      
      // Auto-trigger analysis pipeline
      if (data?.chapterId) {
        apiClient.post("/chapter/process", { chapterId: data.chapterId }).catch(console.error);
      }
    },
    onError: () => {
      setUploadStatus("Error uploading chapter PDF file.");
    }
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !mangaTitle) return;

    setUploadStatus("Uploading files...");
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("mangaTitle", mangaTitle);
    formData.append("chapterNumber", chapterNum);

    uploadMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black text-slate-100 flex">
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-white/5 bg-slate-950/60 backdrop-blur-xl p-6 hidden md:flex flex-col space-y-8">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-8 h-8 text-violet-500" />
          <span className="font-bold text-lg bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
            MangaNarrator AI
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-white/5 text-violet-400 font-medium transition-colors">
            <Compass className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
            <FolderOpen className="w-5 h-5" />
            <span>Library</span>
          </a>
          <a href="/health" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
            <Layers className="w-5 h-5" />
            <span>Diagnostics</span>
          </a>
        </nav>

        <div className="p-4 rounded-xl bg-violet-600/10 border border-violet-500/20 text-xs text-violet-300/80">
          <strong>MVP Mode:</strong> Gemini 2.5 Flash direct page summaries enabled.
        </div>
      </aside>

      {/* Main content grid */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Narration Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Upload manga PDF chapters to generate story narratives.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Uploader Column */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
                  dragActive ? "border-violet-500 bg-violet-500/5" : "border-white/10 hover:border-white/20 bg-white/5"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                <p className="text-sm text-center mb-2 font-medium">
                  {selectedFile ? `Selected: ${selectedFile.name}` : "Drag and drop your manga PDF chapter here"}
                </p>
                <p className="text-xs text-slate-500 mb-4">Support PDFs up to 100MB</p>
                
                <input
                  type="file"
                  id="pdf-upload"
                  className="hidden"
                  accept="application/pdf"
                  onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                />
                <label
                  htmlFor="pdf-upload"
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                >
                  Browse Files
                </label>
              </div>

              {selectedFile && (
                <div className="p-4 glass rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Manga Title</label>
                      <input
                        type="text"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                        value={mangaTitle}
                        onChange={(e) => setMangaTitle(e.target.value)}
                        placeholder="e.g. One Punch Man"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Chapter Number</label>
                      <input
                        type="number"
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                        value={chapterNum}
                        onChange={(e) => setChapterNum(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-sm font-semibold rounded-lg shadow-lg hover:shadow-violet-600/20 transition-all"
                  >
                    Upload and Process
                  </button>
                </div>
              )}
            </form>

            {uploadStatus && (
              <div className="p-3 bg-white/5 border border-white/5 rounded-lg text-xs text-indigo-300">
                {uploadStatus}
              </div>
            )}
          </div>

          {/* Library / Queue Status Column */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold tracking-tight">Active Library</h2>
              
              {isLoading ? (
                <p className="text-xs text-slate-400">Loading catalog...</p>
              ) : mangas && mangas.length > 0 ? (
                <div className="space-y-3">
                  {mangas.map((manga) => (
                    <div key={manga.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <h3 className="text-sm font-semibold">{manga.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{manga.chaptersCount} Chapters available</p>
                      </div>
                      <a
                        href={`/manga/${manga.id}/read`}
                        className="p-2 hover:bg-white/5 rounded-full text-violet-400 transition-colors"
                      >
                        <PlayCircle className="w-5 h-5" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No mangas processed yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
