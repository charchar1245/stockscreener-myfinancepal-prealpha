import { getLiveStockFinancials, getLiveStockSummary, generateSectorIndustrySymbols, screenerGetFilters } from "./api.js";
import { sectorIndustries } from "./sectorIndustries.js";
import { updateCell } from "./datacalls.js";

document.addEventListener('DOMContentLoaded', () => {

    const industryTitle = document.getElementById('industry-title');
    const generateButton = document.getElementById('myButton');
    const applyChangesButton = document.getElementById('apply-changes-button');

    const row1 = document.querySelector('#row1');
    const row2 = document.querySelector('#row2');
    const row3 = document.querySelector('#row3');
    const row4 = document.querySelector('#row4');
    const row5 = document.querySelector('#row5');

    const itemsRow1 = row1.querySelectorAll('p');
    const itemsRow2 = row2.querySelectorAll('p');
    const itemsRow3 = row3.querySelectorAll('p');
    const itemsRow4 = row4.querySelectorAll('p');
    const itemsRow5 = row5.querySelectorAll('p');

    const allItemsRows = [itemsRow1, itemsRow2, itemsRow3, itemsRow4, itemsRow5];

    const sectorSelect = document.getElementById('sectors');
    const industrySelect = document.getElementById('industries');
    const rankedBySelect = document.getElementById('rankedby');
    const regionSelect = document.getElementById('regions');

    sectorSelect.addEventListener('change', () => {
        const selectedSector = sectorSelect.value;
        industrySelect.innerHTML = '';
        if (selectedSector != 'sector-placeholder') {
            addOption(industrySelect, '', 'Select Industry');
            sectorIndustries[selectedSector].forEach(industry => {
                addOption(industrySelect, industry, industry);
            });
        } else {
            addOption(industrySelect, '', 'Need Sector');
        }
    });

    let regionsCache = null;

    async function fillRegionSelect() {
        if (!regionsCache) {
            regionsCache = await screenerGetFilters();
        }
        regionsCache.forEach(region => {
            addOption(regionSelect, region.value, region.displayName);
        });
    }

    function addOption(selectElement, value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        selectElement.appendChild(option);
    }

    fillRegionSelect();

    var graphItems = getGraphItems();

    generateButton.addEventListener('click', async () => {
        const currentlySelectedSector = sectorSelect.options[sectorSelect.selectedIndex].text;
        industryTitle.textContent = industrySelect.value;

        let finalRegion = (regionSelect.value == 'region-placeholder') ? 'us' : regionSelect.value;
        let finalRankedBy = (rankedBySelect.value == 'default') ? 'intradaymarketcap' : rankedBySelect.value;

        const symbolJSON = await generateSectorIndustrySymbols(currentlySelectedSector, industrySelect.value, finalRegion, finalRankedBy);
        const arrayOfQuotes = symbolJSON.finance.result[0].quotes || [];
        console.log(arrayOfQuotes);

        // Pass only existing symbols to updateRows
        const symbolArray = arrayOfQuotes.map(quote => quote.symbol);
        updateRows(symbolArray, graphItems);
    });

    applyChangesButton.addEventListener('click', () => {
        graphItems = getGraphItems();
    });

    async function updateRows(symbolsArray, graphItems) {
        const allRows = [itemsRow1, itemsRow2, itemsRow3, itemsRow4, itemsRow5];
        clearGridRows(allRows);

        await Promise.all(allItemsRows.map(async (itemsRow, rowIndex) => {
            const symbol = symbolsArray[rowIndex];
            if (!symbol) {
                // Leave this row empty if no symbol
                return;
            }

            const financialsData = await getLiveStockFinancials(symbol);
            const stockSummary = await getLiveStockSummary(symbol);
            const APIData = [stockSummary, financialsData];
            var industry = industrySelect.value;

            updateCell(0, getGraphValues()[0], APIData, itemsRow);
            updateCell(1, getGraphValues()[1], APIData, itemsRow);
            updateCell(2, getGraphValues()[2], APIData, itemsRow);
            updateCell(3, getGraphValues()[3], APIData, itemsRow);
            updateCell(4, getGraphValues()[4], APIData, itemsRow, industry);
            updateCell(5, getGraphValues()[5], APIData, itemsRow);
        }));
    }

    function clearGridRows(rows) {
        rows.forEach(row => {
            row.forEach(cell => {
                cell.textContent = '';
            });
        });
    }

    const editGraphButton = document.getElementById('menu-button');
    editGraphButton.addEventListener('click', () => {
        const menu = document.getElementById('menu');
        menu.classList.toggle('show');
    });

    function getGraphItems() {
        const dropdowns = document.querySelectorAll('#graphItems select');
        const currentSelections = [];
        dropdowns.forEach(dropdown => {
            currentSelections.push(dropdown.options[dropdown.selectedIndex].text);
        });
        const columnTitles = document.querySelectorAll('#top-row p');
        for (var i = 0; i < 6; i++) {
            columnTitles[i].textContent = currentSelections[i];
        }
        return currentSelections;
    }

    function getGraphValues() {
        const dropdowns = document.querySelectorAll("#graphItems select");
        const currentSelectionsValues = [];
        dropdowns.forEach(dropdown => {
            currentSelectionsValues.push(dropdown.value);
        });
        return currentSelectionsValues;
    }

});

function getRandomInt(n) {
    return Math.floor(Math.random() * n);
}
