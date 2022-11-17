import axios from "axios";
import { load } from "cheerio";
import fs from "fs";

// URL of the page we want to scrape
const url = "https://www.rttuotetieto.fi/rakennustuotteet/2-runkorakennustuotteet/21-betonituotteet/213-valmisbetonit.html?rt_producttype=79336&product_list_limit=100";

// Async function which scrapes the data
async function scrapeData() {
    try {
        // Fetch HTML of the page we want to scrape
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = load(data);
        // Select all the a items in item-long-product-name class
        const listItems = $(".item-long-product-name a");
        // Stores data for all ids
        const ids = {
            codeProductCatalog: []
        };
        // Loop through "a" items and extract href links
        // Slice href link to get only the id part
        // Push ids to id variable
        listItems.each((idx, el) => {
            const id = el.attribs.href.split('-').pop().slice(0, -5)
            ids.codeProductCatalog.push(id);
        });
        // Logs ids array to the console
        console.log(ids);
        // Write ids array in ids.json file
        fs.writeFile("ids.json", JSON.stringify(ids, null, 2), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Successfully written data to file");
        });
    } catch (err) {
        console.error(err);
    }
}
// Invoke the above function
scrapeData();