import React, { memo, MutableRefObject } from 'react';
import styled from 'styled-components';
import { MenuItemCard, StyledMenuItemCard } from './MenuItemCard';
import { StoreItem, StoreMenu } from '../types/StoreData';
import './Menu.css';

const StyledMenu = styled.div`
  background-color: rosybrown;

  > div > div {
    margin-top: 10px;
  }
`;

const MenuItemContainer = styled.div`
  background-color: #d8b3a5;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  /* row-gap: 20px; */
`;

const MenuItemContainerTitle = styled.h2`
  grid-column: 1 / span 2;
  padding-top: auto;
  padding-bottom: auto;
  margin-top: 0;
  margin-bottom: 0;
  @media (min-width: 320px) {
    grid-column: 1 / span 1;
  }
`;

const MenuItemCards = styled.div`
  display: grid;
  flex: 1;
  > div {
    height: 100%;
  }

  @media (min-width: 320px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 20px;
    row-gap: 20px;

    & ${StyledMenuItemCard}:nth-child(2n + 1) {
      margin-left: auto;
    }
  }
`;

const MenuItemCardsContainer = styled.div`
  display: flex;
  grid-column: 1 / span 2;

  /* justify-content: center; */

  @media (min-width: 640px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

type MenuProps = {
  menuInfo: StoreMenu;
  itemsInfo: StoreItem[];
};

export const Menu = React.forwardRef<
  Array<HTMLDivElement>,
  React.PropsWithChildren<MenuProps>
>((props, ref) => {
  let categories = props.menuInfo.category.map((category, idx) => {
    let categoryKey = `${category.category_id}-${category.category_name}`
    return (
      <div
        id={`${categoryKey}`}
        className="menu-category"
        ref={(thisRef) => {
          if (ref != null) {
            // remove (instance: HTMLDivElement[] | null) => void) type from ref
            let rref = ref as MutableRefObject<(HTMLDivElement | null)[]>;
            if (rref.current != null) {
              // link ref using category idx
              rref.current[idx] = thisRef;
            }
          }
          return null;
        }}
      >
        <MenuItemContainerTitle>
          {category.category_name}
        </MenuItemContainerTitle>

        <MenuItemCardsContainer>
          <MenuItemCards>
            {category.items.map((item) => {
              return (
                <MenuItemCard
                  name={props.itemsInfo[item.item_id - 1].name}
                  description={
                    props.itemsInfo[item.item_id - 1].description ?? ''
                  }
                  imgURL={''}
                  price={props.itemsInfo[item.item_id - 1].price ?? ''}
                />
              );
            })}
          </MenuItemCards>
        </MenuItemCardsContainer>
      </div>
    );
  });

  return (
    <StyledMenu>
      <div>{categories}</div>
    </StyledMenu>
  );
});

function areEqual(prevProps: MenuProps, nextProps: MenuProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */

  if (prevProps.itemsInfo.length == nextProps.itemsInfo.length) {
    return true;
  }
  return false;
}

export const MemoizedMenu = memo(Menu, areEqual);
