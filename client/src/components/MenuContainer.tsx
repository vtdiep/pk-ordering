import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MemoizedMenu, Menu } from './Menu';
import { StoreData } from '../types/StoreData';
import _ from 'lodash';

const StyledMenuContainer = styled.div`
  grid-column: 2 / span 2;
  display: flex;
  flex-direction: column;
  /* row-gap: 50px; */

  @media (min-width: 320px) {
    grid-column: 1 / span 4;
  }
`;

type MenuContainerProps = {
  storeData: StoreData | null;
  addMenuRef: any;
  changeActiveNavItem: (navItemNumber: number) => void;
  navItemRefs: MutableRefObject<(HTMLElement | null)[]> | undefined;
};

export const MenuContainer = ({
  storeData,
  addMenuRef,
  changeActiveNavItem,
  navItemRefs, // references to items in the navbar
}: MenuContainerProps) => {
  let scrollInProgress = false;
  let topSectionNumber = -1;
  let visibleSectionNumbers: number[] = [];

  // assume section ids are in order from least to greatest
  let insertIntoVisibleSection = function (a: number) {
    let firstVisibleSection: number;
    if (!visibleSectionNumbers.length) {
      visibleSectionNumbers.push(a);
      return;
    }
    firstVisibleSection = visibleSectionNumbers.at(0)!;

    // scrolling up
    if (a < firstVisibleSection) {
      visibleSectionNumbers.unshift(a);
    }
    // scrolling down
    else if (a > firstVisibleSection) {
      visibleSectionNumbers.push(a);
    }
  };
  // assume section ids are in order from least to greatest
  let removeFromVisibleSection = function (sectionNumber: number) {
    let firstVisibleSection: number;
    if (!visibleSectionNumbers.length) {
      return;
    } else {
      firstVisibleSection = visibleSectionNumbers.at(0)!;
    }

    // scrolling down; no longer visible
    if (sectionNumber == firstVisibleSection) {
      visibleSectionNumbers.shift();
    }
    // scrolling up; last item in array no longer visible
    else if (sectionNumber > firstVisibleSection) {
      visibleSectionNumbers.pop();
    }
  };

  /**
   * Toggles class:active-nav-item on/off depending on which section is in view at the top
   * @param idx Index of the ref that triggered this function
   * @returns 
   */
  let wrappedCallbackFunction = (idx: number): IntersectionObserverCallback => {
    let fx: IntersectionObserverCallback = (entries) => {
      console.log(`interaction observer for category ${idx}`);
      entries.forEach((entry) => {
        console.log(`intersectionRect ${entry.intersectionRect}`);
        console.log(entry.isIntersecting);
        const clientRect = entry.boundingClientRect;
        console.log(`bounding client rect ${JSON.stringify(clientRect)}`);

        if (entry.isIntersecting) {
          insertIntoVisibleSection(idx);
        } else {
          removeFromVisibleSection(idx);
        }

        console.log(visibleSectionNumbers);

        topSectionNumber = visibleSectionNumbers.at(0) ?? -1;
        console.log(`top visible section is ${topSectionNumber}`);

        navItemRefs?.current[topSectionNumber]?.classList.add(
          'active-nav-item',
        );
        if (!scrollInProgress) {
          scrollInProgress = true;
          setTimeout(() => {
            scrollInProgress = false;
          }, 0);
          navItemRefs?.current[topSectionNumber]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
        navItemRefs?.current.map((navItem, index) => {
          if (topSectionNumber != index) {
            console.log(`removing active-nav-item for ${index}`);
            navItem?.classList.remove('active-nav-item');
          }
        });
      });

      console.log(`end interaction observer for ${idx}`);
    };
    return _.throttle(fx, 0, { leading: true, trailing: true });
  };

  let options: IntersectionObserverInit = {
    root: null,
    rootMargin: '-74px 0px -64px 0px',
    // top: height of navbar
    // bottom: height of checkout
    threshold: [0],
    // delay: 100,
  };

  /**
   * A ref can be used with multiple current elements.
   * We will pass this ref into Menu, where the ref will be linked to 
   * categories in the Menu
   */
  const menuCategoryRefs = useRef<Array<HTMLDivElement>>([]);
  let observers: IntersectionObserver[] = [];

  // slice instead of reset to empty array,
  // because useEffect called after component rendered 
  // (ie after the ref callbacks are called)
  // if we reset refs to empty, we would lose the elements
  useEffect(() => {
    menuCategoryRefs.current = menuCategoryRefs.current.slice(
      0,
      storeData?.data.menus[0].category.length,
    );

    // attach an IntersectionObserver to each ref
    menuCategoryRefs.current.map((category, idx) => {
      var observer = new IntersectionObserver(
        wrappedCallbackFunction(idx),
        options,
      );

      observer.observe(category);
      observers.push(observer);
    });

    return () => {
      observers.map((ob, ix) => {
        ob.disconnect();
      });
    };
  }, [storeData?.data.menus]);

  let menuItems = storeData?.data.menus.map((menuItem, idx) => {
    return (
      <MemoizedMenu
        ref={menuCategoryRefs}
        menuInfo={menuItem}
        itemsInfo={storeData?.data.items}
      ></MemoizedMenu>
    );
  });

  let cat = useCallback(() => {
    return storeData?.data.menus.map((menuItem, idx) => {
      return (
        <Menu
          ref={menuCategoryRefs}
          menuInfo={menuItem}
          itemsInfo={storeData?.data.items}
        ></Menu>
      );
    })[0];
  }, [storeData]);

  return (
    <StyledMenuContainer>
      {/* <Menu> </Menu> */}
      {/* <Menu ref={ref2}></Menu> */}
      {/* {menuItems?.[0]} */}
      {cat()}
    </StyledMenuContainer>
  );
};
