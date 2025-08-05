
async function getLiveStockFinancials(symbol) {
    var stockSymbol = symbol;

    const url = 'https://yahoo-finance-real-time1.p.rapidapi.com/stock/get-financials?symbol=' + stockSymbol + '&lang=en-US&region=US';

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '1b25dbd835mshad146cd3c15035cp15f74cjsnbd020fb2b285',
            'x-rapidapi-host': 'yahoo-finance-real-time1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function getLiveStockSummary(symbol) {
    var stockSymbol = symbol;

    const url = 'https://yahoo-finance-real-time1.p.rapidapi.com/stock/get-summary?lang=en-US&symbol=' + stockSymbol + '&region=US';

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '1b25dbd835mshad146cd3c15035cp15f74cjsnbd020fb2b285',
            'x-rapidapi-host': 'yahoo-finance-real-time1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        return result;
    } catch (error) {
        console.error(error);
    }
}


async function generateSectorIndustrySymbols(sector, industry, region, rankedBy) {

    const url = 'https://yahoo-finance166.p.rapidapi.com/api/screener/list?sortType=DESC&sortField=' + rankedBy + '&size=30&quote_type=EQUITY&offset=0&region=US';
    const options = {

        method: 'POST',
        headers: {
            'x-rapidapi-key': '1b25dbd835mshad146cd3c15035cp15f74cjsnbd020fb2b285',
            'x-rapidapi-host': 'yahoo-finance166.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            operator: 'and',
            operands: [
                {
                    operator: 'EQ',
                    operands: ['sector', sector]
                },
                {
                    operator: 'EQ',
                    operands: ['industry', industry]
                },
                {
                    operator: 'GT',
                    operands: ['price', 1]
                },
                {
                    operator: 'EQ',
                    operands: ['region', region]
                }
            ],
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        return result;
    } catch (error) {
        console.error(error);
    }

}

async function screenerGetFilters() {
    const url = 'https://yahoo-finance166.p.rapidapi.com/api/screener/get-filters?type=earnings';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '1b25dbd835mshad146cd3c15035cp15f74cjsnbd020fb2b285',
            'x-rapidapi-host': 'yahoo-finance166.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        const labels = result.finance.result[0].fields.region.labels;

        const regions = labels.map(label => {
            return {
                displayName: label.displayName,
                value: label.criteria.operands[1]
            };
        });

        return regions;
    } catch (error) {
        console.error(error);
    }
}

export { getLiveStockFinancials, getLiveStockSummary, generateSectorIndustrySymbols, screenerGetFilters };