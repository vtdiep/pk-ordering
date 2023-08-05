import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { ModchoicesDTO } from '../../types/ModchoicesDTO';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Choices } from '../../types/Modifiers';
import { Item } from '../../types/Item';
import { ModData } from '../../types/ModData';
import { UnifiedModInfo } from '../../types/UnifiedModInfo';
import { ModifierOption } from './ModifierOption';

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
  /* background-color: rgba(91, 112, 131, 0.4); */
  background-color: #e0dfd6;
  overflow-y: scroll;
`;

/**
 * Return mapping of mod_id to {modData, modchoiceData}
 * @param modchoiceData
 * @param modData
 * @returns
 */
function unifyModInfo(
  modchoiceData: Array<ModchoicesDTO>,
  modData: Array<ModData>,
) {
  let unifiedDataMap = new Map<Number, UnifiedModInfo>();
  modData.forEach((modDataItem) => {
    if (modDataItem.mod_id == undefined) return;
    unifiedDataMap.set(modDataItem.mod_id, modDataItem);
  });
  modchoiceData.forEach((modchoiceDataItem) => {
    const modID = modchoiceDataItem.mod_id;
    let modDataItem = unifiedDataMap.get(modID);
    if (modDataItem == undefined) return;
    modDataItem.choices = modchoiceDataItem.choices;
  });
  return unifiedDataMap;
}

export const ItemModal = (props: ModchoicesDTO) => {
  const [itemData, setItemData] = useState<Item>();
  const [modchoices, setModchoices] = useState<Array<ModchoicesDTO>>([]);
  const [modData, setModData] = useState<Array<ModData>>([]);
  let unifiedModInfo = new Map<Number, UnifiedModInfo>();
  let modOrder: Number[] = [];
  const [entries, setEntries] = useState<Array<JSX.Element | undefined>>([]);

  let navigate = useNavigate();
  let { itemURLIdentifier } = useParams() ?? '';

  let indexOfHyphenInItemURL: number =
    itemURLIdentifier?.lastIndexOf('-') ?? -1;

  let itemName = itemURLIdentifier?.substring(0, indexOfHyphenInItemURL);
  let itemID = itemURLIdentifier?.substring(indexOfHyphenInItemURL + 1);

  useEffect(() => {
    document.body.style.overflowY = 'hidden';
  }, []);

  // fetch items first
  useEffect(function fetchItems() {
    async function fetchItemData() {
      let response: AxiosResponse<Item, any> = await axios.get(
        `http://localhost:3000/item/${itemID}?include=true`,
      );

      if (response.data) {
        setItemData(response.data);
      }
    }
    fetchItemData();
  }, []);

  // fetch modifier data using item data
  useEffect(
    function fetchModchoices() {
      async function fetchModchoiceData() {
        let x: AxiosResponse<ModchoicesDTO[], any> | null = await axios.get(
          `http://localhost:3000/modchoice/${itemID}`,
        );
        let returnedDataObject: ModchoicesDTO[] | null = x?.data ?? [];
        setModchoices(returnedDataObject);
      }
      fetchModchoiceData();
    },
    [itemData, itemID],
  );

  // fetch modchoice data using modifier data
  // and unify both datasets
  useEffect(
    function fetchModData() {
      async function fetchModData() {
        let modIDSet = new Set<number>();
        modchoices.forEach((modchoice) => {
          modIDSet.add(modchoice.mod_id);
        });
        if (modIDSet.size == 0) return;

        let modIDs = [...modIDSet].join(',');
        let x: AxiosResponse<ModData[], any> | null = await axios.get(
          `http://localhost:3000/modgroup/?ids=${modIDs}`,
        );
        if (x === null) {
          return;
        }
        setModData(x.data);
        unifiedModInfo = unifyModInfo(modchoices, modData);

        if (!itemData) return;
        let order = itemData.mods.sort((a, b) => {
          return a.display_order - b.display_order;
        });

        modOrder = order.map((value) => {
          return value.mod_id;
        });
        // console.log(modOrder);

        let e = modOrder.map((mod_id) => {
          console.log(unifiedModInfo);

          let data = unifiedModInfo.get(mod_id);
          console.log(data);
          if (!data) return;
          return (
            <ModifierOption
              name={data.name}
              required_selection={data.required_selection}
              max_selection={data.max_selection}
              max_single_select={data.max_single_select}
              free_selection={data.free_selection}
              description={data.description}
              choices={data.choices}
            ></ModifierOption>
          );
        });

        setEntries(e);
      }
      fetchModData();
    },
    [modchoices],
  );

  if (indexOfHyphenInItemURL === -1) {
    //todo: error msg
    return null;
  }

  return (
    <StyledDiv>
      <span
        onClick={(e: any) => {
          document.body.style.overflow = 'unset';
          navigate('/');
        }}
      >
        Close
      </span>

      <h2>
        {itemName}-{itemID}
      </h2>

      <img src="http://placekitten.com/100/100" alt="" />

      <p>{itemData?.description}</p>

      <>
        {/* <ModifierOptionSlider max={4} min={0}/> */}
        <ModifierOption
          name={'Select choices'}
          required_selection={0}
          max_selection={3}
          max_single_select={0}
          free_selection={0}
          choices={[1, 2] as unknown as Choices[]}
        ></ModifierOption>
        {entries}
        {/* {modchoices.map( (mod,idx) => {
          // mod.choices.map( val => {
          //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          //   val.name
          // })
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          // return <b>{mod.mod_id}</b> 

          // todo: optimize to remove call to find
          return <ItemModalCard modchoices={mod} modData={modData.find( (val)=> {
            return val.mod_id == mod.mod_id
          })}></ItemModalCard>
        })} */}
        {/* {itemData?.mods.forEach()} */}
        {/* <ViewCheckoutButton /> */}
      </>
    </StyledDiv>
  );
};
