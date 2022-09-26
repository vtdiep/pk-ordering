import { MutableRefObject, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MenuContainer } from './MenuContainer';
import { Nav } from './Nav';
import axios, { AxiosResponse } from 'axios';
import { StoreData, StoreMenu } from '../types/StoreData';

const StyledStore = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

export interface StoreProps {
  children?: React.ReactNode;
}

export const Store = () => {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [menus, setMenus] = useState<StoreMenu[] | null>(null);

  const [menuRefs, setMenuRefs] = useState<React.MutableRefObject<null>[]>([]);
  const [navItemRefs, setNavItemRefs] =
    useState<React.MutableRefObject<Array<HTMLElement | null>>>();

  const addMenuRef = (ref: MutableRefObject<null>) => {
    setMenuRefs([...menuRefs, ref]);
  };

  const setMenuNavItem = useCallback(
    (ref: React.MutableRefObject<Array<HTMLElement | null>>) => {
      setNavItemRefs(ref);
    },
    [],
  );

  useEffect(() => {
    async function fetchData() {
      let x: AxiosResponse<StoreData, any> | null = await axios.get(
        'http://localhost:3000/store',
      );
      let returnedDataObject: StoreData | null = x?.data ?? null;
      setStoreData(returnedDataObject);
      setMenus(returnedDataObject?.data.menus ?? null);
    }
    fetchData();
  }, []);

  // not used
  const [activeNavItem, setActiveNavItem] = useState<number>(-1);

  function changeNavItem(navItemNumber: number) {
    setActiveNavItem(navItemNumber);
  }

  return (
    <StyledStore>
      <Nav
        menus={menus}
        setMenuNavItem={setMenuNavItem}
        activeNavItem={activeNavItem}
        changeActiveNavItem={changeNavItem}
      />

      {menus ? (
        <MenuContainer
          storeData={storeData}
          addMenuRef={addMenuRef}
          changeActiveNavItem={changeNavItem}
          navItemRefs={navItemRefs}
        />
      ) : (
        <div>Coming soon!</div>
      )}
    </StyledStore>
  );
};
