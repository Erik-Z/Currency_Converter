import React, { useState, useEffect } from "react";

function CurrencyConverter() {
    const [eurValue, setEurValue] = useState(0);
    const [usdValue, setUsdValue] = useState(0);
    const [fxRate, setfxRate] = useState(1.1);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newUSDValue = eurValue * 1.1;
        setUsdValue(newUSDValue);
    };

    // Update the fxValue value every 3 seconds with a random value
    useEffect(() => {
        const intervalId = setInterval(() => {
            const randomValue = Math.round((Math.random() * 0.1 - 0.05) * 100) / 100;
            setfxRate((prevfxRate) => prevfxRate + randomValue);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);


    const handleAmountChange = (e) => {
        setEurValue(e.target.value);
    };

    return (
    <div>
        <p>fx Rate: {Math.round(fxRate * 100) / 100}</p>
        <form onSubmit={handleSubmit}>
        <label>
            Enter amount in EUR:
            <input
            type="number"
            value={eurValue}
            onChange={handleAmountChange}
            />
        </label>
        <button type="submit">Convert</button>
        </form>
        <p>Converted amount in USD: {Math.round(usdValue * 100) / 100}</p>
    </div>
    );
}

export default CurrencyConverter;