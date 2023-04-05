import React from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.scss";
import Sidenav from "./Sidenav";

const PageComponent = (props) => {

  return (
    <div className={styles.pageComponent}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLinks}>
          <Link className={styles.linkButton} to="/">
            <div className={styles.buttonText}>
              <h2>Recipes</h2>
            </div>
          </Link>
          <Link className={styles.linkButton} to="/pantry">
            <div className={styles.buttonText}>
              <h2>Pantry</h2>
            </div>
          </Link>
          <Link className={styles.linkButton} to="/tools">
            <div className={styles.buttonText}>
              <h2>Tools</h2>
            </div>
          </Link>
          <Link className={styles.linkButton} to="/meal-prep">
            <div className={styles.buttonText}>
              <h2>Meals</h2>
            </div>
          </Link>
        </div>
        <Sidenav links={props.sidenavLinks} />
      </div>
      <div className={styles.pageBody}>
        <div className={styles.pageContent}>
          <h1 className={styles.header}>{props.header}</h1>
          {props.children}
        </div>
      </div>
    </div>
  );
};
export default PageComponent;
