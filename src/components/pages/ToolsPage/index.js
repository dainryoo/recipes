import React, { useState } from "react";
import PageComponent from "Common/PageComponent";
import CopyButton from "Common/CopyButton";
import tools from "Data/constants/tools.json";
import styles from "./index.module.scss";

const ToolsPage = () => {
  const bowls = tools.filter((tool) => tool.tags.includes("bowl"));
  const pans = tools.filter((tool) => tool.tags.includes("baking"));

  const WeightInputCalculator = ({ bowl }) => {
    const [value, setValue] = useState("");

    const handleChange = (event) => {
      const input = event.target.value;
      setValue(input);
    };

    const contentsWeight = value ? value - bowl.weightInGrams : "";

    return (
      <div className={styles.bowlCalculatorContainer}>
        <p className={styles.bowlInfo}>{bowl.name} {bowl.note ? `(${bowl.note})` : null} weighs <span >{bowl?.weightInGrams} g</span></p>
        <p className={styles.weightCalculator}>
          Total: <input value={value} onChange={handleChange}  /> g
          {
            contentsWeight !== "" && !isNaN(contentsWeight) ?
              <>
                <span className={styles.arrowIcon}>→</span>
                Contents Weight: <span className={styles.contentsWeight}>{contentsWeight} g</span>
                <CopyButton clipboardText={contentsWeight}/>
              </>
              :
              null
          }
        </p>
      </div>
    );
  }

  return (
    <PageComponent header="Tools Page">
      <h2>Bowls</h2>
      {
        bowls.map((bowl) => <WeightInputCalculator key={bowl.name} bowl={bowl} />)
      }
      <h2>Pans</h2>
      {
        pans.map((pan) => {
          return (
            <div>
              <h3>
                {pan.name}
                {
                  pan?.note ? 
                    <span className={styles.panNote}>({pan.note})</span>
                    :
                    null
                }  
              </h3>
              {
                pan?.dimensions ? 
                  <p>Dimensions: {pan.dimensions.join(", ")}</p>
                  :
                  null
              }
              {
                pan?.volume ? 
                  <p>Volume: {pan.volume.join(", ")}</p>
                  :
                  null
              }
            </div>
          )
        })
      }
    </PageComponent>
  );
};
export default ToolsPage;
