import { createContext, useContext, useState, useRef } from "react"

const ScrapeConfigContext = createContext(null)

export const ScrapeConfigProvider = ({ children }) => {
  const [url, setUrl] = useState('')
  const [tree, setTree] = useState(null)
  const [flow, setFlow] = useState('new')
  const [retrievalInstructions, setRetrievalInstructions] = useState([])
  const lastBuiltUrlRef = useRef('')

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
    <ScrapeConfigContext.Provider value={{ 
      url,
      setUrl,
      tree,
      setTree,
      flow,
      setFlow,
      retrievalInstructions, 
      addInstruction, 
      deleteInstruction, 
      setKey,
      clearInstructions,
      lastBuiltUrlRef
    }}>
      {children}
    </ScrapeConfigContext.Provider>
  )
}

export const useScrapeConfig = () => {
  const context = useContext(ScrapeConfigContext)
  if (!context) {
    throw new Error("useScrapeConfig must be used within a ScrapeConfigProvider")
  }
  return context
}

export const useRetrievalInstructions = () => {
  const context = useScrapeConfig()
  return {
    retrievalInstructions: context.retrievalInstructions,
    addInstruction: context.addInstruction,
    deleteInstruction: context.deleteInstruction,
    setKey: context.setKey,
    clearInstructions: context.clearInstructions
  }
}

