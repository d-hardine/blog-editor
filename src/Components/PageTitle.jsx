import { useEffect } from "react";
import { useLocation } from "react-router";

//Dynamically change the page title based on the route
const PageTitle = ({title}) => {
    const location = useLocation()

    useEffect(() => {
        document.title = title
    }, [location, title])

    return null
}

export default PageTitle