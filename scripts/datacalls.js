function updateCell(cellNumber, data, APIdata, itemsRow, industrySelected) {
    var finalText;
    if (data == 'symbol') {
        finalText = getSymbolName(APIdata[0]);
    } else if (data == 'price') {
        finalText = getRegularMarketPrice(APIdata[0]);
    } else if (data == 'sgrow1') {
        finalText = getSalesGrowth(APIdata[1], 1);
    } else if (data == 'sgrow3') {
        finalText = getSalesGrowth(APIdata[1], 3);
    } else if (data == 'om') {
        finalText = getOperatingMargin(APIdata[1], industrySelected);
    } else if (data == 'P/S') {
        finalText = getPriceToSalesRatio(APIdata[0]);
    } else if (data == 'name') {
        finalText = getName(APIdata[0]);
    } else if (data == 'beps') {
        finalText = getBasicEPS(APIdata[1]);
    } else if (data == 'deps') {
        finalText = getDilutedEPS(APIdata[1]);
    } else if (data == 'percentchange') {
        finalText = getPercentChangeIntraday(APIdata[0]);
    } else if (data == 'marketcap') {
        finalText = getMarketCap(APIdata[0]);
    } else if (data == 'P/E') {
        finalText = getPriceToEarnings(APIdata[0], APIdata[1]);
    }

    // For each cell N of each items row, textContent is set to finalText
    itemsRow[cellNumber].textContent = finalText;

    if (finalText === "N/A") {
        itemsRow[cellNumber].classList.add("na-cell");
    } else {
        itemsRow[cellNumber].classList.remove("na-cell");
    }

}

function getSymbolName(stockSummary) {
    const symbolName = stockSummary.price.symbol;
    return symbolName;
}

function getRegularMarketPrice(stockSummary) {
    const regularMarketPrice = stockSummary.price.regularMarketPrice;
    return regularMarketPrice;
}

function getSalesGrowth(financialsData, year) {

    //1 YR Sales Growth
    var rawRevenue24 = '';
    var rawRevenue23 = '';
    var rawRevenue21 = '';

    //From getLiveStockFinancials - /get-financials
    const yearsAround = financialsData.incomeStatementHistory.incomeStatementHistory.length;

    //If stock is infantile, display N/A for 1yr, 3yr
    if (yearsAround == 0) {
        return 'N/A';
    } else if (yearsAround == 1) {

        if (year == 1) {
            return '100%';
        } else {
            return 'N/A';
        }

    } else if (yearsAround == 2) {

        rawRevenue24 = financialsData.incomeStatementHistory.incomeStatementHistory[0].totalRevenue.raw;

        rawRevenue23 = financialsData.incomeStatementHistory.incomeStatementHistory[1].totalRevenue.raw;

        const salesGrowth1YrRaw = rawRevenue24 / rawRevenue23;
        const salesGrowth1Yr = Math.round((salesGrowth1YrRaw - 1) * 100).toString() + '%';

        if (year == 1) {
            return salesGrowth1Yr;
        } else {
            return 'N/A';
        }

    } else {
        rawRevenue24 = financialsData.incomeStatementHistory.incomeStatementHistory[0].totalRevenue.raw;

        rawRevenue23 = financialsData.incomeStatementHistory.incomeStatementHistory[1].totalRevenue.raw;

        rawRevenue21 = financialsData.incomeStatementHistory.incomeStatementHistory[3].totalRevenue.raw;

        const salesGrowth1YrRaw = rawRevenue24 / rawRevenue23;
        const salesGrowth1Yr = Math.round((salesGrowth1YrRaw - 1) * 100).toString() + '%';

        const salesGrowth3YrRaw = rawRevenue24 / rawRevenue21;
        const salesGrowth3Yr = Math.round((salesGrowth3YrRaw - 1) * 100).toString() + '%';

        if (rawRevenue24 == 0 || rawRevenue23 == 0 || rawRevenue21 == 0) {
            return 'N/A';
        }

        if (year == 1) {
            return salesGrowth1Yr;
        } else {
            return salesGrowth3Yr;
        }

    }
}

function getOperatingMargin(financialsData, industry) {
    let myTrailingOperatingIncome = null;
    let myTrailingTotalRevenue = null;

    if (financialsData?.timeseries?.trailingPretaxIncome?.[0]?.reportedValue?.raw != null) {
        myTrailingOperatingIncome = financialsData.timeseries.trailingPretaxIncome[0].reportedValue.raw;
    }

    if (financialsData?.timeseries?.trailingTotalRevenue?.[0]?.reportedValue?.raw != null) {
        myTrailingTotalRevenue = financialsData.timeseries.trailingTotalRevenue[0].reportedValue.raw;
    }

    if (myTrailingOperatingIncome == null || myTrailingTotalRevenue == null || myTrailingTotalRevenue == 0) {
        return "N/A";
    }

    const operatingMarginRaw = myTrailingOperatingIncome / myTrailingTotalRevenue;
    const operatingMargin = Math.round(operatingMarginRaw * 100).toString() + '%';
    return operatingMargin;
}

function getPriceToSalesRatio(stockSummary) {
    const priceToSales = stockSummary?.summaryDetail?.priceToSalesTrailing12Months;

    if (priceToSales == null || priceToSales === 0) {
        return "N/A";
    } else {
        return priceToSales.toString();
    }
}

function getName(stockSummary) {
    const stockName = stockSummary.quoteType.shortName;
    return stockName;
}

function getBasicEPS(financialsData) {
    const basicEPS = financialsData.timeseries.trailingBasicEPS[0].reportedValue.raw;
    return basicEPS;
}   

function getDilutedEPS(financialsData) {
    const dilutedEPS = financialsData.timeseries.trailingDilutedEPS[0].reportedValue.raw;
    return dilutedEPS;
}

function getPercentChangeIntraday(stockSummary) {
    const previousClose = stockSummary.summaryDetail.regularMarketPreviousClose;
    const price = stockSummary.summaryDetail.regularMarketPrice;

    const percentChange = ((price - previousClose) / previousClose) * 100;
    return percentChange.toString() + '%';
}

function getMarketCap(stockSummary) {
    const marketCap = stockSummary.summaryDetail.marketCap;
    return marketCap;
}

function getPriceToEarnings(stockSummary, financialsData) {
    const basicEPS = financialsData.timeseries.trailingBasicEPS[0].reportedValue.raw;
    const regularMarketPrice = stockSummary.price.regularMarketPrice;

    const PERatio = regularMarketPrice / basicEPS;
    return PERatio;
}

export { updateCell };