"use client"

import { useState } from "react"
import { FluxFloatingButton } from "./flux-floating-button"
import { FluxFloatingPanel } from "./flux-floating-panel"

export function FluxAssistant() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <FluxFloatingButton onClick={toggleOpen} isOpen={isOpen} />
      {isOpen && <FluxFloatingPanel isOpen={isOpen} onClose={toggleOpen} />}
    </>
  )
}
