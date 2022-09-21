import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { ItemModalProps } from "../types/ItemModelProps";
import { useEffect } from "react";

const StyledDiv = styled.div`
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 0px;
    background-color: rgba(91, 112, 131, 0.4);
`

export const ItemModal = (props:ItemModalProps) =>{

    useEffect( () => {
        document.body.style.overflowY = 'hidden';
    }, [])

    let navigate = useNavigate()
    let {name} = useParams()
    // let name = props.name

    return (
        <StyledDiv>
            {name}
            <span onClick={(e:any) =>{
                document.body.style.overflow = 'unset';
                navigate('/') }
                }>Close</span>
        </StyledDiv>
    )
}