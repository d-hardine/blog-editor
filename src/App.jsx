import { useState } from "react"
import { Outlet } from "react-router"
import Header from "./Components/Header"
import Footer from "./Components/Footer"

const App = () => {
    const [headerUsername, setHeaderUsername] = useState('')

    return (
        <>
            <Header headerUsername={headerUsername} setHeaderUsername={setHeaderUsername}/>
            <Outlet context={[headerUsername, setHeaderUsername]}/>
            <Footer />
        </>
    )
}

export default App