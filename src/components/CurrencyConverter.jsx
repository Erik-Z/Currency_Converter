import React, { useState, useEffect } from "react";

function CurrencyConverter() {
    const [eurValue, setEurValue] = useState(0);
    const [usdValue, setUsdValue] = useState(0);
    const [fxRate, setfxRate] = useState(1.1);
    const [convertToEur, setConvertToEur] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!convertToEur) {
            const eurValue = usdValue * fxRate;
            setEurValue(eurValue);
        } else {
            const usdValue = eurValue / fxRate;
            setUsdValue(usdValue);
        }
    };

    // Update the fxValue value every 3 seconds with a random value
    useEffect(() => {
        const intervalId = setInterval(() => {
            const randomValue = Math.round((Math.random() * 0.1 - 0.05) * 100) / 100;
            setfxRate((prevfxRate) => prevfxRate + randomValue);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    // Updates currency value when fxRate is changed (Step 3)
    useEffect(() => {
        if (!convertToEur) {
            if (eurValue != 0){
                const eurValue = usdValue * fxRate;
                setEurValue(eurValue);
            }
        } else {
            if (usdValue != 0){
                const usdValue = eurValue / fxRate;
                setUsdValue(usdValue);
            }
        }
    }, [fxRate]);


    const handleAmountChange = (e) => {
        convertToEur ? setEurValue(e.target.value) : setUsdValue(e.target.value);
    };

    const handleToggleConversion = () => {
        setConvertToEur((prevValue) => !prevValue);
        if (convertToEur) {
            setUsdValue(eurValue);
            setEurValue(0);
        } else {
            setEurValue(usdValue)
            setUsdValue(0);
        }
    };

    const convertedValue = convertToEur ? Math.round(usdValue * 100) / 100 : Math.round(eurValue * 100) / 100;
    const originalValue = convertToEur ? Math.round(eurValue * 100) / 100 : Math.round(usdValue * 100) / 100;
    const fromCurrency = convertToEur ? 'USD' : 'EUR';
    const toCurrency = convertToEur ? 'EUR' : 'USD';

    return (
    <div>
        <p>fx Rate: {Math.round(fxRate * 100) / 100}</p>
        <form onSubmit={handleSubmit}>
        <label>
            Enter amount in {fromCurrency}:
            <input
            type="number"
            value={originalValue}
            onChange={handleAmountChange}
            />
        </label>
        <button type="submit">Convert</button>
        </form>
        <p>Converted amount in {toCurrency}: {convertedValue}</p>

        <button onClick={handleToggleConversion}>Convert to {toCurrency}</button>
    </div>
    );
}

export default CurrencyConverter;