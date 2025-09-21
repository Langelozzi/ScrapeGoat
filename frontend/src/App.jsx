import { useState } from 'react'

function App() {
  const [url, setUrl] = useState("");
  const [tree, setTree] = useState(null);

  const buildTree = async function() {
    fetch(import.meta.env.VITE_API_URL + '/dom-tree/build', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    })
      .then(response => response.json())
      .then(json => { setTree(json.root); console.log(json); })
      .catch(error => console.error(error));
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-black via-purple-900 to-black text-white p-8">
      {/* Title */}
      <h1 className="text-6xl text-emerald-200 font-extrabold mt-20 mb-10">Scrapegoat</h1>

      {/* Input */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Enter website URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-96 p-4 text-lg bg-white rounded-2xl text-black shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
        />

        <button
          className="px-8 py-4 text-lg font-bold bg-white rounded-2xl text-black shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-400 hover:bg-purple-200 transition"
          onClick={buildTree}
        >
          Submit
        </button>
      </div>

      {/* Output */}
      <div>
        {tree ? JSON.stringify(tree) : 'no tree :('}
      </div>
    </div>
  )
}

export default App
