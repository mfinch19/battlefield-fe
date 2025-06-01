import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import Map from './components/Map'
import Chat from './components/Chat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex flex-row items-center justify-center min-h-screen">
        <div className="flex-1 h-screen">
          <Chat />
        </div>
        <div className="flex-1 h-screen">
          <Map />
        </div>
      </div>
      <p className="text-3xl font-bold underline">

      </p>
    </>
  )
}

export default App
