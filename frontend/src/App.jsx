import { useState, useEffect } from 'react'
import TreeNode from './TreeNode';
import Selection from './Selection.jsx';

function App() {
  const [url, setUrl] = useState("");
  const [tree, setTree] = useState(null);
  const [retrieval_instructions, setInstructions] = useState([]);

  const placeholder_data = {
    "root": {
      "id": 1,
      "raw": "<html>...</html>",
      "tag_type": "html",
      "hasData": false,
      "htmlAttributes": {},
      "body": "",
      "children": [
        {
          "id": 2,
          "raw": "<h1>No Data Currently Displayed<h1/>",
          "tag_type": "h1",
          "hasData": true,
          "htmlAttributes": { "class": "text" },
          "body": "No Data Currently Displayed",
          "retrieval_instructions": []
        },
        {
          "id": 3,
          "raw": "<p>Please enter a URL<p/>",
          "tag_type": "p",
          "hasData": true,
          "htmlAttributes": { "class": "text" },
          "body": "Please enter a URL",
          "retrieval_instructions": []
        }
      ],
      "retrieval_instructions": []
    }
  }

  const buildTree = async function() {
    fetch(import.meta.env.VITE_API_URL + '/api/v1/scraper/dom-tree/build', {
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

  const scrape = async function() {
    console.log(retrieval_instructions);
    fetch(import.meta.env.VITE_API_URL + '/api/v1/scraper/scrape', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        url: url,
        retrieval_instructions: retrieval_instructions,
      })
    })
      .then(response => response.json())
      .then(json => { console.log(json); })
      .catch(error => console.error(error));
  }

  const addToInstructions = (instruction) => {
    setInstructions(prev => [...prev, instruction]);
  }

  const handleSetKey = (index, value) => {
    setInstructions(prev =>
      prev.map((inst, i) =>
        i === index
          ? {
              ...inst,
              output: {
                ...(inst.output || {}),
                key: value,
              },
            }
          : inst
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-fuchsia-950 via-purple-300 to-fuchsia-950 text-white p-8">
      {/* Title */}
      <h1 className="text-6xl text-emerald-200 font-extrabold mt-20 mb-10">Scrapegoat</h1>

      {/* Input */}
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Enter website URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mb-10 w-96 p-4 text-lg bg-white rounded-2xl text-black shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-400"
        />

        <button
          className="mb-10 px-8 py-4 text-lg font-bold bg-white rounded-2xl text-black shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-400 hover:bg-purple-200 transition"
          onClick={buildTree}
        >
          Submit
        </button>
      </div>

      {/* Output */}
      <div className='w-[60rem]'>
        {tree
          ? <TreeNode node={tree} addToInstructions={addToInstructions} />
          : <TreeNode node={placeholder_data.root} addToInstructions={addToInstructions} />
        }
      </div>

      {/* Instruction Building */}
      <h1 className="text-3xl font-bold">Your Selection</h1>
      <Selection
        instructions={retrieval_instructions}
        onSetKey={handleSetKey}   // <-- pass the updater into Selection
      />

      <button
        className="mb-10 px-8 py-4 text-lg font-bold bg-white rounded-2xl text-black shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-400 hover:bg-purple-200 transition"
        onClick={scrape}
      >
        Scrape
      </button>
    </div>
  )
}

export default App
