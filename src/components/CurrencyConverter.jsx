import React, { useState, useEffect } from "react";

function CurrencyConverter() {
    const [eurValue, setEurValue] = useState(0);
    const [usdValue, setUsdValue] = useState(0);
    const [fxRate, setfxRate] = useState(1.1);
    const [overriddenFxRate, setOverriddenFxRate] = useState(1.1);
    const [isOverrideActivated, setisOverrideActivated] = useState(false);
    const [convertToEur, setConvertToEur] = useState(false);
    const [historicalData, setHistoricalData] = useState([]);

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

    const currentFxRate = () => {
        return isOverrideActivated ? overriddenFxRate : fxRate
    }

    // Update the fxValue value every 3 seconds with a random value
    useEffect(() => {
        const intervalId = setInterval(() => {
            const randomValue = Math.round((Math.random() * 0.1 - 0.05) * 100) / 100;
            const differenceOffset = (fxRate + randomValue) * 0.02;
            if(overriddenFxRate - (fxRate + randomValue) > differenceOffset){
                if(isOverrideActivated){
                    setisOverrideActivated(false);
                }
            }
            setfxRate((prevfxRate) => prevfxRate + randomValue);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    // Updates currency value when fxRate is changed (Step 3)
    useEffect(() => {
        if (!convertToEur) {
            if (eurValue != 0){
                const eurValue = usdValue * currentFxRate();
                setEurValue(eurValue);
            }
        } else {
            if (usdValue != 0){
                const usdValue = eurValue / currentFxRate();
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

    const handleFxRateChange = (event) => {
        setOverriddenFxRate(parseFloat(event.target.value));
    };

    const handleUseOverrideFxRate = (event) => {
        setisOverrideActivated(true);
    };

    const convertedValue = convertToEur ? Math.round(usdValue * 100) / 100 : Math.round(eurValue * 100) / 100;
    const originalValue = convertToEur ? Math.round(eurValue * 100) / 100 : Math.round(usdValue * 100) / 100;
    const fromCurrency = convertToEur ? 'USD' : 'EUR';
    const toCurrency = convertToEur ? 'EUR' : 'USD';

    useEffect(() => {
        const newHistoricalData = [...historicalData];
        if (historicalData.length >= 5) {
          newHistoricalData.shift();
        }
        newHistoricalData.push({
          fromCurrency,
          toCurrency,
          originalValue,
          convertedValue,
          fxRate,
          overriddenFxRate
        });
        setHistoricalData(newHistoricalData);
    }, [fxRate, toCurrency]);

    return (
    <div>
        <p>fx Rate: {Math.round(fxRate * 100) / 100}</p>
        <p hidden={!isOverrideActivated}> Currently Overridden! </p>
        <label>
            fxRate Override: 
            <input type="number" step="0.01" value={Math.round(overriddenFxRate * 100) / 100} onChange={handleFxRateChange}/>
        </label>
        <button onClick={handleUseOverrideFxRate}>Override FX rate</button>
        
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

        <br />
        <h2>Historical Data</h2>
        <table>
            <thead>
            <tr>
                <th>Original</th>
                <th>Converted</th>
                <th>FX Rate</th>
                <th>Override</th>
            </tr>
            </thead>
            <tbody>
            {historicalData.map((data, index) => (
                <tr key={index}>
                <td>{data.originalValue.toFixed(2)} {data.fromCurrency}</td>
                <td>{data.convertedValue.toFixed(2)} {data.toCurrency}</td>
                <td>{data.fxRate.toFixed(2)}</td>
                <td>{data.overriddenFxRate.toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    );
}

export default CurrencyConverter;