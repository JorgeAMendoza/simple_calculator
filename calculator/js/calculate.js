//Global Variables for postfix conversion
let operandStack;
let postFix;

//Link DOM elements
const calculatorDisplay = document
  .querySelector("#display")
  .querySelector("#num-text");
const calculatorNumbers = document.querySelectorAll(".num-input");
const calculatorFunctions = document.querySelectorAll(".num-func");
const calculatorClear = document.querySelector(".num-clear");
const calculatorBack = document.querySelector(".num-back");
const calculatorEnter = document.querySelector(".num-enter");

function calculateExpression() {
  let infixExpression = calculatorDisplay.textContent.split(" ");
  let postfixExpression = toPostFix(infixExpression);
  calculatorDisplay.innerHTML = evaluatePostFix(postfixExpression);
}

const toPostFix = (expression) => {
  postFix = [];
  operandStack = [];
  for (let i = 0; i < expression.length; i++) {
    let ch = expression[i];
    switch (ch) {
      case "+":
      case "-":
        getOper(ch, 1);
        break;
      case "*":
      case "/":
        getOper(ch, 2);
        break;
      case "(":
        operandStack.push(ch);
        break;
      case ")":
        getParen();
        break;
      default:
        postFix.push(ch);
        break;
    }
  }
  while (operandStack.length !== 0) {
    postFix.push(operandStack.pop());
  }

  return postFix;
};

const getOper = (opThis, prec1) => {
  while (operandStack.length !== 0) {
    let opTop = operandStack.pop();
    if (opTop == "(") {
      operandStack.push(opTop);
      break;
    } else {
      let prec2;

      prec2 = opTop == "+" || opTop == "-" ? 1 : 2;

      if (prec2 < prec1) {
        operandStack.push(opTop);
        break;
      } else {
        postFix.push(opTop);
      }
    }
  }
  operandStack.push(opThis);
};

function getParen() {
  while (operandStack.length !== 0) {
    let chx = operandStack.pop();
    if (chx == "(") break;
    else postFix.push(chx);
  }
}

function evaluatePostFix(expression) {
  let answerStack = [];
  let num1, num2, ch, interAns;
  for (let i = 0; i < expression.length; i++) {
    ch = expression[i];
    if (!isNaN(ch)) {
      answerStack.push(ch);
    } else {
      num2 = +answerStack.pop();
      num1 = +answerStack.pop();
      switch (ch) {
        case "+":
          interAns = num1 + num2;
          break;
        case "-":
          interAns = num1 - num2;
          break;
        case "*":
          interAns = num1 * num2;
          break;
        case "/":
          interAns = num1 / num2;
          break;
        default:
          interAns = 0;
          break;
      }
      answerStack.push(interAns);
    }
  }

  return answerStack.pop();
}

function start() {
  //Event listener for adding operands to calculator
  calculatorNumbers.forEach((e) =>
    e.addEventListener(
      "click",
      () => (calculatorDisplay.innerHTML += `${e.textContent}`)
    )
  );

  //Set Event lisnters for adding operators to calculator
  calculatorFunctions.forEach((e) => {
    e.addEventListener("click", () => {
      let ch = e.textContent;
      switch (ch) {
        case "(":
          calculatorDisplay.innerHTML += `${ch} `;
          break;
        case ")":
          calculatorDisplay.innerHTML += ` ${ch}`;
          break;
        default:
          calculatorDisplay.innerHTML += ` ${ch} `;
      }
    });
  });

  //Clear and backscape buttons
  calculatorClear.addEventListener("click", () => {
    calculatorDisplay.innerHTML = "";
  });

  calculatorBack.addEventListener("click", () => {
    let newExpression;
    let lastInput = calculatorDisplay.textContent.slice(-1);
    if (lastInput == " ") {
      newExpression = calculatorDisplay.textContent.slice(0, -3);
    } else {
      newExpression = calculatorDisplay.textContent.slice(0, -1);
    }

    calculatorDisplay.innerHTML = newExpression;
  });

  calculatorEnter.addEventListener("click", calculateExpression);
}

window.addEventListener("load", start);
