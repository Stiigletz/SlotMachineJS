const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

const collDeposit = () => {
    while (true) {
        const depositAmount = prompt("Input Your Deposit: ");
        const numDepositAmount = parseFloat(depositAmount);

        if (isNaN(numDepositAmount) || numDepositAmount <= 0) {
        console.log("Invalid Amount, Please input a numerical value greater than 0");
        } else {
            return numDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter how many lines you want to bet on (1-3): ");
        const numOfLines = parseFloat(lines);

        if (isNaN(numOfLines) || numOfLines <= 0 || numOfLines > 3) {
        console.log("Invalid number of lines try again");
        } else {
            return numOfLines;
        }
    }  
}

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Input Your Bet Per Line: ");
        const numBet = parseFloat(bet);

        if (isNaN(numBet) || numBet <= 0 || numBet > balance / lines) {
        console.log("Invalid Bet, try again");
        } else {
            return numBet;
        }
    }
};

const spin = () => {
    const symbols = [];
    for ( const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
                const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString);
    }
}

const getReward = (rows, bet, lines) => {
    let reward = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let isSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                isSame = false;
                break;
            }
        }
        
        if (isSame) {
            reward += bet * SYMBOL_VALUES[symbols[0]];
        }
    
    }
    return reward;
};

const slots = () => {
    let balance = collDeposit();

    while (true) {
        console.log("Your balance is $" + balance);
        const numOfLines = getNumberOfLines();
        const bet = getBet(balance, numOfLines);
        balance -= bet * numOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const reward = getReward(rows, bet, numOfLines)
        balance += reward;
        console.log("Look at what you won dickhead, $" + reward.toString());

        if (balance <= 0) {
            console.log("You lost it all, oh noooooooooo!");
            break;
        }

        const spinAgain = prompt("Wana lose some more (y/n)?");

        if (spinAgain != "y") break;
    }
};
slots();