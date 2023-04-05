import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { filterListBy } from "Data/utils/basicUtils";
import styles from "./index.module.scss";

const Sidenav = ({ links }) => {
  const [ isHidden, setIsHidden ] = useState(true);
  // Keep track of the values inside of the search bar to filter the dropdown list of all recipes
  const [ inputValue, setInputValue ] = useState("");

  // Confirm whether the current page is a recipe page or a ingredient page
  const currentPath = useLocation();
  const pathParts = currentPath.pathname.replace(/^\/|\/$/g, '').split("/");
  const isRecipePage = links && pathParts[0] !== "pantry";

  // Handle when Sidenav button is clicked
  const toggleSidenav = () => {
    setIsHidden(!isHidden);
    const linksList = document.getElementsByClassName(styles.linksContainer)?.[0];
    if (linksList) {
      linksList.scrollTop = 0; // reset link list scroll position to the top
    }
  }

  // Get the currently selected sub-recipe or sub-ingredient page (i.e. has an ID), if any
  const currentlySelectedId = (isRecipePage ? pathParts?.[0] : pathParts?.[1]) || null;

  const filteredLinks = filterListBy(links, inputValue);

  return links ? (
    <div className={styles.sidenav}>
      <button className={styles.sidenavButton} onClick={() => toggleSidenav()}>
        <div className={styles.buttonBackground}></div> 
        <div className={`${styles.navIcon} ${isHidden ? "" : styles.open}`}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <div className={`${styles.popoutMenu} ${isHidden ? styles.hidden : ""}`}>
        <div className={styles.sidenavSearchbar}>
          <input 
            placeholder={`Type to filter${isRecipePage ? " recipes" : ""}...`}
            className={styles.dropdownSearchBar}
            onChange={e => setInputValue(e.target.value)}
            value={inputValue}
          />
        </div>
        <div className={styles.linksContainer}>
          {
            filteredLinks.length > 0 ?
              filteredLinks.map((link) => {
                const isDivider = link === "divider";
                return (
                  isDivider ?
                    <div className={styles.divider} key="divider"></div>
                    :
                    <Link
                      className={`${styles.linkContainer} ${currentlySelectedId === link.id ? styles.selected : ""}`}
                      key={link.id}
                      onClick={() => toggleSidenav()}
                      to={`/${isRecipePage ? "" : "pantry/"}${link.id}`}
                    >
                      <div>
                        {link.name}
                      </div>
                    </Link>
                );
              })
              :
              <p className={styles.noLinkMatches}>No matches found</p>
          }
        </div>
      </div>
    </div>
  ) : null;
};
export default Sidenav;
