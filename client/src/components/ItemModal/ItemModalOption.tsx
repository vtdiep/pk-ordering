import styled from "styled-components";
import { UnifiedModInfo } from "../../types/UnifiedModInfo";

const ItemModalOptionDiv = styled.div`
    display: grid;
`

export const ItemModalOption = (modID: number, unifiedModInfoMap: Map<Number, UnifiedModInfo>) => {

    let modInfo = unifiedModInfoMap.get(modID)
    if(modInfo == undefined) return

    // modInfo.required_selection

    let choices = modInfo.choices

    return (
        <ItemModalOptionDiv>
            <h2>{modInfo.name}</h2>

        </ItemModalOptionDiv>
    )
}