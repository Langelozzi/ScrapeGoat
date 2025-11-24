import { createContext, useContext, useState, useRef } from "react"

const RetrievalInstructionContext = createContext(null)

export const RetrievalInstructionProvider = ({ children }) => {
  const [url, setUrl] = useState("")
  const [tree, setTree] = useState(null)
  const [flow, setFlow] = useState("saved")
  const [name, setName] = useState(null)
  const [description, setDescription] = useState(null)
  const [retrievalInstructions, setRetrievalInstructions] = useState([])
  const lastBuiltUrlRef = useRef("")

  const addInstruction = (instruction) => {
    setRetrievalInstructions((prev) => [...prev, instruction])
  }

  const deleteInstruction = (index) => {
    setRetrievalInstructions((prev) => prev.filter((_, i) => i !== index))
  }

  const setKey = (index, value) => {
    setRetrievalInstructions((prev) =>
      prev.map((inst, i) =>
        i === index
          ? { ...inst, output: { ...(inst.output || {}), key: value } }
          : inst
      )
    )
  }

  const clearInstructions = () => {
    setRetrievalInstructions([])
  }

  const value = {
    url,
    setUrl,
    tree,
    setTree,
    flow,
    setFlow,
    name,
    setName,
    description,
    setDescription,
    retrievalInstructions,
    setRetrievalInstructions,
    addInstruction,
    deleteInstruction,
    setKey,
    clearInstructions,
    lastBuiltUrlRef,
  }

  return (
    <RetrievalInstructionContext.Provider value={value}>
      {children}
    </RetrievalInstructionContext.Provider>
  )
}

export const useRetrievalInstructions = () => {
  const context = useContext(RetrievalInstructionContext)
  if (!context) {
    throw new Error(
      "useRetrievalInstruction must be used within a RetrievalInstructionProvider"
    )
  }
  return context
}

export default RetrievalInstructionProvider
