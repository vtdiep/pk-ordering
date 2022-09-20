import { Link, useRouteError } from "react-router-dom"
import styled from "styled-components"

type RouteErrorPlaceholderType = {
    statusText: string
    data: any
    status: number
    message?: string

}

const StyledDiv = styled.div`
    text-align: center;
`

export const Error = () => {
    let error = useRouteError() as RouteErrorPlaceholderType
    console.log(error)
    return (
        <StyledDiv>
            <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to='/'>
        <button>Home Page</button> 
        </Link>
        </StyledDiv>
    )
}