import { MouseEvent, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { StoreMenu } from '../types/StoreData';
import './Nav.css';

const StyledNav = styled.nav`
  grid-column: 1 / span 4;
  border-bottom: 1px solid grey;
  padding-top: 5px;
  padding-bottom: 5px;

  position: sticky;
  top: 0;
  background-color: #f7f7f7;
  overflow-y: scroll;
  width: 100%;
`;

const StyledUL = styled.ul`
  display: inline-flex;
  list-style-type: none;
  column-gap: 20px;
  background-color: #e4e4e4;

  margin-left: auto;
  margin-right: auto;
  padding: 10px 10px 0 10px;
  white-space: nowrap;
  /* min-width: max(75%, 500px); */

  & li {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    scroll-margin-right: 50px;
  }

  @media (min-width: 640px) {
    /* max size of card + card gutter */
    max-width: calc(640px * 2 + 20px);
  }
`;

const ULContainer = styled.div`
  @media (min-width: 640px) {
    margin-left: 20px;
    margin-right: 20px;
  }
`;

export const Nav = ({
  menus,
  setMenuNavItem,
  activeNavItem,
  changeActiveNavItem,
}: {
  menus: StoreMenu[] | null;
  setMenuNavItem: (ref: React.MutableRefObject<(HTMLElement | null)[]>) => void;
  activeNavItem: number;
  changeActiveNavItem: (navItemNumber: number) => void;
}) => {
  const navItemRef = useRef<Array<HTMLElement | null>>([]);

  // reset refs when # of categories FOR MENU 0 change
  useEffect(() => {
    navItemRef.current = navItemRef.current.slice(
      0,
      menus?.[0].category?.length,
    );
    setMenuNavItem(navItemRef);
  }, [menus?.[0].category?.length]);

  // placeholder for when overriding default behavior might be desired; could be removed
  let handleClick = (
    e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>,
    idx: number,
  ) => {
    console.log(e.target);
    let ele: HTMLElement = e.currentTarget;
    let target = navItemRef.current.find((ref) => ref === ele);
    console.log(target);
    console.log(idx);
  };

  let listItems = menus?.[0].category.map((category, idx) => {
    return (
      <li
        className={activeNavItem == idx ? 'active-nav-item' : ''}
        key={category.mxc_display_order}
        onClick={(e) => handleClick(e, idx)}
      >
        <a
          className={`navItem-${idx}`}
          href={'#cat-' + idx.toString()}
          ref={(r) => {
            navItemRef.current[idx] = r;
          }}
        >
          {category.category_name}
        </a>
      </li>
    );
  });

  return (
    <StyledNav>
      <ULContainer>
        <StyledUL>
          <li>Navigation Text</li>
          <li>Nav2</li>
          <li>Navigation Text Long Long Long</li>
          {listItems}
        </StyledUL>
      </ULContainer>
    </StyledNav>
  );
};
