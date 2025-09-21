import { useState } from 'react'

function App() {
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-black via-purple-900 to-black text-white p-8">
      {/* Title */}
      <h1 className="text-6xl text-emerald-200 font-extrabold mt-20 mb-10">Scrapegoat</h1>

      {/* Input Bar */}
      <input
        type="text"
        placeholder="Enter website URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-200 p-4 text-lg bg-white rounded-2xl text-black shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
      />
    </div>
  )
}

export default App
