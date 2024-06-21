import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";
import { calData } from "./static/staticData";
import ConfettiExplosion from 'react-confetti-explosion';
import { evaluate, format } from 'mathjs';

export default function App() {
  const [inputExpression, setInputExpression] = useState("");
  const [previousResult, setPreviousResult] = useState(null);
  const [memory, setMemory] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [isRadian, setIsRadian] = useState(true);

  const handleButtonClick = (symbol) => {
    setInputExpression((prevExpression) => prevExpression + symbol);
  };

  const handleEqualsClick = () => {
    try {
      const result = evaluate(inputExpression);
      setInputExpression(result.toString());
      setPreviousResult(result);

      // Check for confetti condition
      if (/5[\+\-\*\/]6|6[\+\-\*\/]5/.test(inputExpression)) {
        setConfetti(true);
        setConfettiKey(prevKey => prevKey + 1); // Ensure unique key for confetti component
        setTimeout(() => setConfetti(false), 3000);
      }
    } catch (error) {
      setInputExpression("Error");
    }
  };

  const handleClear = () => {
    setInputExpression("");
    setPreviousResult(null);
  };

  const handleMemoryClear = () => {
    setMemory(null);
  };

  const handleMemoryAdd = () => {
    setMemory(previousResult);
  };

  const handleMemorySubtract = () => {
    setMemory((prevMemory) => prevMemory - previousResult);
  };

  const handleMemoryRecall = () => {
    setInputExpression((prevExpression) => prevExpression + memory);
  };

  const handleToggleDegreesRadians = () => {
    setIsRadian(!isRadian);
  };

  const handleSpecialFunctions = (symbol) => {
    let result;
    try {
      switch (symbol) {
        case "sin":
          result = isRadian ? Math.sin(previousResult) : Math.sin(previousResult * Math.PI / 180);
          break;
        case "cos":
          result = isRadian ? Math.cos(previousResult) : Math.cos(previousResult * Math.PI / 180);
          break;
        case "tan":
          result = isRadian ? Math.tan(previousResult) : Math.tan(previousResult * Math.PI / 180);
          break;
        case "log":
          result = Math.log10(previousResult);
          break;
        case "ln":
          result = Math.log(previousResult);
          break;
        case "sqrt":
          result = Math.sqrt(previousResult);
          break;
        case "sqr":
          result = Math.pow(previousResult, 2);
          break;
        case "cube":
          result = Math.pow(previousResult, 3);
          break;
        case "exp":
          result = Math.exp(previousResult);
          break;
        case "rand":
          result = Math.random();
          break;
        default:
          result = "Error";
      }
      setInputExpression(result.toString());
      setPreviousResult(result);
    } catch (error) {
      setInputExpression("Error");
    }
  };

  const handleImmediateOperation = (operation) => {
    let result;
    try {
      const value = parseFloat(inputExpression);
      switch (operation) {
        case "x²":
          result = Math.pow(value, 2);
          break;
        case "x³":
          result = Math.pow(value, 3);
          break;
        case "xʸ":
          setInputExpression((prevExpression) => prevExpression + "^");
          return; 
        case "eˣ":
          result = Math.exp(value);
          break;
        case "1/x":
          result = 1 / value;
          break;
        case "√x":
          result = Math.sqrt(value);
          break;
        case "³√x":
          result = Math.cbrt(value);
          break;
        default:
          result = "Error";
      }
      setInputExpression(result.toString());
      setPreviousResult(result);
    } catch (error) {
      setInputExpression("Error");
    }
  };

  const handleFactorial = (num) => {
    if (num < 0) return "Error";
    return num === 0 ? 1 : num * handleFactorial(num - 1);
  };

  return (
    <Grid
      sx={{
        width: "80%",
        m: "auto",
        mt: "80px",
        borderRadius: "10px",
        bgcolor: "#414141",
        color: "white",
        border: "1px solid black",
      }}
      container
    >
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <TextField
          value={inputExpression}
          sx={{
            "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
              color: "white",
              textAlign: "right",
              fontSize: "30px",
            },
          }}
          fullWidth
        />
      </Grid>
      {calData.map((e) => (
        <Grid
          item
          lg={e.Symbol === "0" ? 2.4 : 1.2}
          md={e.Symbol === "0" ? 2.4 : 1.2}
          sm={e.Symbol === "0" ? 2.4 : 1.2}
          xs={e.Symbol === "0" ? 2.4 : 1.2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid black",
            display: "flex",
            p: "10px",
            bgcolor:
              e.name === "number"
                ? "#73736e"
                : e.type === "norOper"
                ? "#f0a03a"
                : "#555555",
            borderBottomLeftRadius:
              e.name ===
                "Toggles between primary and secondary functions on the calculator" &&
              "10px",
          }}
          key={e.name}
          onClick={() => {
            if (e.name === "assignment") {
              handleEqualsClick();
            } else if (e.name === "clear TextField") {
              handleClear();
            } else if (e.name === "Clears the memory") {
              handleMemoryClear();
            } else if (e.name === "Adds the current value to the memory") {
              handleMemoryAdd();
            } else if (e.name === "Subtracts the current value from the memory") {
              handleMemorySubtract();
            } else if (e.name === "Recalls the value stored in memory") {
              handleMemoryRecall();
            } else if (e.name === "Toggles between radians and degrees for trigonometric functions") {
              handleToggleDegreesRadians();
            } else if (["sin", "cos", "tan", "log", "ln", "sqrt", "sqr", "cube", "exp", "rand"].includes(e.Symbol)) {
              handleSpecialFunctions(e.Symbol);
            } else if (["x²", "x³", "xʸ", "eˣ", "1/x", "√x", "³√x"].includes(e.Symbol)) {
              handleImmediateOperation(e.Symbol);
            } else if (e.Symbol === "x!") {
              setInputExpression(handleFactorial(previousResult).toString());
            } else {
              handleButtonClick(e.Symbol.toString());
            }
          }}
        >
          {e.type === "sub" ? (
            <p>
              {e.Symbol}
              <sub>{e.subSymble}</sub>
            </p>
          ) : e.type === "sup" ? (
            <p>
              {e.Symbol}
              <sup>{e.subSymble}</sup>
            </p>
          ) : (
            <p>{e.Symbol}</p>
          )}
        </Grid>
      ))}
      {confetti && <ConfettiExplosion key={confettiKey} />}
    </Grid>
  );
}
