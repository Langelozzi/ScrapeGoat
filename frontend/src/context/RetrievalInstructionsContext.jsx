import { createContext, useContext, useState } from "react"

const RetrievalInstructionsContext = createContext(null)

export const RetrievalInstructionsProvider = ({ children }) => {
  const [retrievalInstructions, setRetrievalInstructions] = useState([])

  const addInstruction = (instruction) => {
    setRetrievalInstructions((prev) => [...prev, instruction])
  }

  const deleteInstruction = (index) => {
    setRetrievalInstructions((prev) => prev.filter((_, i) => i !== index))
  }

  const setKey = (index, value) => {
    setRetrievalInstructions((prev) =>
      prev.map((inst, i) =>
        i === index ? { ...inst, output: { ...(inst.output || {}), key: value } } : inst
      )
    )
  }

  const clearInstructions = () => {
    setRetrievalInstructions([])
  }

  return (
    <RetrievalInstructionsContext.Provider value={{ 
      retrievalInstructions, 
      addInstruction, 
      deleteInstruction, 
      setKey,
      clearInstructions
    }}>
      {children}
    </RetrievalInstructionsContext.Provider>
  )
}

export const useRetrievalInstructions = () => {
  const context = useContext(RetrievalInstructionsContext)
  if (!context) {
    throw new Error("useRetrievalInstructions must be used within a RetrievalInstructionsProvider")
  }
  return context
}

