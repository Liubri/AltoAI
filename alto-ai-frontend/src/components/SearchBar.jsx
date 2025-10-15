import { useState } from "react"
import api from "../utils/api.js"
export default function SearchBar() {
    const [input, setInput] = useState("")


    function handleChange(e) {
        setInput(e.target.value)
    }

    async function sendInput() {
        await api.post("/spotify/login")
    }
    
    const handleEnter = (e) => {
        if (e.key === "Enter") {
        sendInput()
        }
    }

    console.log(input);
    return (
        <div>
            <input onChange={handleChange} onKeyDown={handleEnter}/>
        </div>
    )
}
