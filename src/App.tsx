import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState(['hi', 'heyy'])
  const wsRef = useRef();
  const messageRef = useRef();

  useEffect(() => {
    const ws = new WebSocket('http://localhost:8080');

    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])
    };

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'join',
        payload: {
          roomId: 'red' 
        }
      }))
    };

    return () => {
      ws.close()
    }
  }, [])

  return (
    <div className='h-screen bg-black flex flex-col'>
      <br />
      <div className='h-[90vh]'>
        {messages && messages.map((message) => 
        <div className='m-8'>
          <span className='bg-white text-black rounded p-4'>{
            message}
          </span>
        </div>
        )}
      </div>
      <div className='w-full bg-white flex p-5'>
        <input ref={messageRef} className='flex-1 p-2 mr-2' type="text" />
        <button onClick={() => {
          console.log('click',messageRef.current.value )
          wsRef.current.send(JSON.stringify({
            type: 'chat',
            payload: {
              message: messageRef.current.value
            }
          }))
        }} className='bg-purple-600 text-white p-5 rounded-lg mt-2 flex justify-center'>Send Message</button>
      </div>
    </div>
  )
}

export default App
