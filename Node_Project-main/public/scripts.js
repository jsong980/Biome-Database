/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating HumidityAndCloudCoverage!");
    }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Humidity and CloudCoverage added!";
        fetchTableData();
    } else {
        messageElement.textContent = "Specified humidity already exists!";
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();

    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("resetTempPrecipitationHumidity").addEventListener("click", resetTempPrecipitationHumidity);
    document.getElementById("insertTempPrecipitationHumidity").addEventListener("submit", insertTempPrecipitationHumidity);
    document.getElementById('joinButton').addEventListener('click', handleJoin);
    document.getElementById('divideNaturalDisaster').addEventListener('click', handleDivision);
    document.getElementById("resetNaturalDisasters").addEventListener("click", resetNaturalDisasters);
    document.getElementById("generateSQL").addEventListener("click", handleSelect);
    document.getElementById("deleteHumidityCloudCoverage").addEventListener("submit", deleteHumidityCloudCoverage);

    document.getElementById("findAvgTemp").addEventListener("submit", avgTemperature);
    document.getElementById("findCityCountForm").addEventListener("submit",findCityCount);

    //Buttons for Selection: 
    // document.getElementById("submit_attribute").addEventListener("click", selectAttributes);
    // document.getElementById("submit_val").addEventListener("click", submitValues);
    // document.getElementById("submit_op").addEventListener("click", submitValues);
    // document.getElementById("submit_attr").addEventListener("click", submitValues);
    // document.getElementById("submit_clause").addEventListener("click", submitValues);
    // document.getElementById("delete_q").addEventListener("click", clearQuery);
    // document.getElementById("submit_q").addEventListener("click", selectFromTable);
    document.getElementById("add_input_boxes").addEventListener("click", addInputBoxes);
    document.getElementById("remove_input_boxes").addEventListener("click", removeInputBoxes);
    document.getElementById("submit_q").addEventListener("click", selectFromHumidityAndCloudCoverage);
   

    //Button for Nested Aggregation With Group By and Having: 
    document.getElementById("sub_nested_a").addEventListener("click", getResultOfNestedAggreQuery);

    //Button for Updating Humidity in TempPrecipitationHumidity: 
    document.getElementById("update_hum").addEventListener("click", updateHumidityChildTable);

    //Button for Updating CloudCoverage in TempPrecipitationHumidity: 
    document.getElementById("update_cc").addEventListener("click", updateCloudCoverage);

    //Button for Update Humidity in HumidityAndCloudCoverage:
    // document.getElementById("update_hum_parent").addEventListener("click", updateHumidityParentTable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
    fetchAndDisplayTempPrecipitationHumidity();
    fetchAndDisplayNaturalDisasters();
    fetchJoinedHumidityPrecip();
    fetchVertebrates();
    fetchCirculationSystems();
    fetchCities();
}

async function fetchJoinedHumidityPrecip() {
    const tableElement = document.getElementById('joinedHumidityPrecip');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/joined-humidity-precip', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tempPrecipitationContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tempPrecipitationContent.forEach(row => {
        const rowElement = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = rowElement.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAndDisplayTempPrecipitationHumidity() {
    const tableElement = document.getElementById('tempPrecipitationTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/temp-precipitation-humidity', {
        method: 'GET'
    });

    const responseData = await response.json();
    const tempPrecipitationContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tempPrecipitationContent.forEach(row => {
        const rowElement = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = rowElement.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Reset the TempPrecipitationHumidity table.
async function resetTempPrecipitationHumidity() {
    const response = await fetch("/reset-temp-precipitation-humidity", {
        method: 'POST'
    });
    const responseData = await response.json();

    const messageElement = document.getElementById('resetTempResultMsg');
    if (responseData.success) {
        messageElement.textContent = "TempPrecipitationHumidity initiated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error initiating TempPrecipitationHumidity table! The original humidities might have been deleted, please try resetting HumidityAndCloudCoverage";
    }
}

// Insert new records into TempPrecipitationHumidity.
async function insertTempPrecipitationHumidity(event) {
    event.preventDefault();

    const temperatureValue = document.getElementById('insertTemperature').value;
    const precipitationValue = document.getElementById('insertPrecipitation').value;
    const humidityValue = document.getElementById('insertHumidity').value;

    const response = await fetch('/insert-temp-precipitation-humidity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            temperature: temperatureValue,
            precipitation: precipitationValue,
            humidity: humidityValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertTempResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Temperature, Precipitation, Humidity added successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "(Temperature, Precipitation) specified already exists or specified Humidity does NOT already exist in Humidity and CloudCoverage table!";
    }
}

// Deletes records from HumidityCloudCoverage.
async function deleteHumidityCloudCoverage(event) {
    event.preventDefault();

    const humidityValue = document.getElementById('deleteHumidity').value;
    const response = await fetch('/delete-humidity-cloud', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            humidity: humidityValue,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteHumidityCloudMsg');

    if (responseData.success) {
        messageElement.textContent = "Humidity deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Specified humidity does not exist!";
    }
}

async function handleJoin() {
    const hasVertebrae = document.getElementById("hasVertebrae").value;
    const tableElement = document.getElementById('joinResultTable');
    const tableBody = tableElement.querySelector('tbody');
   
    const response = await fetch(`/join-vertebrates-circulation?hasVertebrae=${hasVertebrae}`);
    const responseData = await response.json();
    const joinContent = responseData.data;

    const messageElement = document.getElementById('joinResultMsg');
    messageElement.textContent = "Join performed successfully!";


    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }


    joinContent.forEach(row => {
        const rowElement = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = rowElement.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function handleDivision() {
    const tableElement = document.getElementById('divisionResultTable');
    const tableBody = tableElement.querySelector('tbody');
   
    const response = await fetch(`/city-name-division`);
    const responseData = await response.json();

    const joinContent = responseData.data;

    const messageElement = document.getElementById('divisionResultMsg');
    messageElement.textContent = "Division performed successfully!";


    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    joinContent.forEach(row => {
        const rowElement = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = rowElement.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchCirculationSystems() {
    const tableElement = document.getElementById('circulationSystemsTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/circulation-systems', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchCities() {
    const tableElement = document.getElementById('CitiesTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/cities', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchVertebrates() {
    const tableElement = document.getElementById('vertebratesTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/vertebrates', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAndDisplayNaturalDisasters() {
    const tableElement = document.getElementById('NaturalDisastersTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/naturaldisasters', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function resetNaturalDisasters() {
    const response = await fetch("/initiate-natural-disasters", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetNaturalDisastersMsg');
        messageElement.textContent = "natural disasters initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "HumidityCloudCoverage initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

async function handleSelect() {
    const tableElement = document.getElementById('NaturalDisastersTable');
    const tableBody = tableElement.querySelector('tbody');
    
    const checkType = document.getElementById("checkType").checked;
    const checkCity = document.getElementById("checkCity").checked;
    const checkYear = document.getElementById("checkYear").checked;
    const checkAreaDamaged = document.getElementById("checkAreaDamaged").checked;

    let selectedColumns = [];
    let tableHeaders = [];

    if (checkType) {
        selectedColumns.push("NaturalDisasterType");
        tableHeaders.push("NaturalDisasterType");
    }
    if (checkCity) {
        selectedColumns.push("CityName");
        tableHeaders.push("CityName");
    }
    if (checkYear) {
        selectedColumns.push("YearOfMostRecentOccurence");
        tableHeaders.push("YearOfMostRecentOccurence");
    }

    if (checkAreaDamaged) {
        selectedColumns.push("AreaDamaged");
        tableHeaders.push("AreaDamaged");
    }

    // SPACES IN STRING IS MAKING IT FAIL SO HAD TO DO BASE64 (Method learned in 310)
    const queryParams = encodeURIComponent(JSON.stringify(selectedColumns));
    const response = await fetch(`/select-columns?column_names=${queryParams}`);
    const responseData = await response.json();
    const joinContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    // CITE: https://www.geeksforgeeks.org/how-to-append-header-to-a-html-table-in-javascript
    const tableHeaderRow = tableElement.querySelector('thead tr');
    tableHeaderRow.innerHTML = ''; // clear the current header because we're replacing, not adding a new header here
    for (const header of tableHeaders) {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeaderRow.appendChild(th);
    }

    joinContent.forEach(row => {
        const rowElement = tableBody.insertRow();
        row.forEach((field, index) => {
            const cell = rowElement.insertCell(index);
            cell.textContent = field;
        });
    });
}

//===============================================SELECTION: 
//Citations:
// https://www.w3schools.com/jsref/met_node_clonenode.asp
// https://www.w3schools.com/jsref/met_doc_getelementsbyname.asp#:~:text=The%20getElementsByName()%20method%20returns,elements%20with%20a%20specified%20name.
// https://www.w3schools.com/Jsref/prop_node_lastchild.asp 
// https://www.w3schools.com/jsref/prop_style_display.asp 
// https://www.w3schools.com/Jsref/met_select_add.asp#:~:text=The%20add()%20method%20is,use%20the%20remove()%20method. 

//Adds input boxes to the html page
async function addInputBoxes(){
    const node = document.getElementById("user_inputs");
    clone = node.cloneNode(true);

    //Make div visible:
    clone.querySelector('#select_logic_op').style.display = "inline";

    //Create AND option:
    andOption = document.createElement("option")
    andOption.text = "AND";
    andOption.value = "AND"; 

    //Create OR option:
    orOption = document.createElement("option")
    orOption.text = "OR";
    orOption.value = "OR"; 

    //Add both options to the drop down list:
    clone.querySelector('#logic_op').add(andOption);
    clone.querySelector('#logic_op').add(orOption);

    document.getElementById("added_input_boxes").appendChild(clone);
}

// Citations:
// https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild

// Delete input boxes from the html page
// Removes input boxes specifically from div "added_input_boxes"
async function removeInputBoxes() {
    const node = document.getElementById("added_input_boxes");
    element = node.querySelector('#user_inputs');
    node.removeChild(node.lastChild);
}

// Citations:
// https://www.w3schools.com/js/js_htmldom_nodelist.asp

// Selects tuples from HumidityAndCloudCoverage based upon a condition
async function selectFromHumidityAndCloudCoverage(){
    const attributes = document.getElementById("attribute_list").value;
    const userClauses = document.getElementsByName("input_boxes"); 
    const clauses = await constructUserClause(userClauses);
    selectFromTable(attributes, clauses);
}

// Citations:
// https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
// https://developer.mozilla.org/en-US/docs/Web/API/NodeList 

// Given a node, constructs clauses from it and returns it
async function constructUserClause(nodelist){
    let clauses = "";

    nodelist.forEach(node => {
        attribute = node.querySelector('#attr_list').value;
        numVal = node.querySelector('#num_val').value; 
        logicOp = node.querySelector('#logic_op').value;
        if(node.index == 0){
            logicOp = "";
        }
        clauses += ` ${logicOp} ${attribute} = ${numVal}\n`;
    });

    return clauses;
}

// Selects tuples from table based on user's conditions 
async function selectFromTable(userAttributes, userClause){
    //Get user input from the text element on interface:
    const clause_val = userClause; 
    const selected_val = userAttributes;

    //Send the query:
    const response = await fetch("/select-from-hum-cloud-cov", {
        method: 'POST', //sending data
        headers: { //specifies what type of data is sending
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({//actual data need to send
            attributes: selected_val,
            clause: clause_val
        })
    });

    //Check if sending the query was successful: 
    const responseData = await response.json();
    if (responseData.success) {
        alert("Success! Query did go through!");
    }else{
        alert("Error! Query did not go through");
    }

    //Display query:
    const displayResult = document.getElementById('selection_result_msg'); 
    const columns = responseData.result.metaData;
    const rows = responseData.result.rows;
    text = "";

    for(let i in columns){
        text += columns[i].name + "  ";
    }
    text += "\n";
    for(let j in rows){
        text += rows[j] + "\n";
    }
    displayResult.textContent = text;
}

// Erases both the selected attributes and the user clause from the html page.
// async function clearQuery(){
//     const clause = document.getElementById('update_user_clause'); 
//     const selected = document.getElementById('update_selected_attributes'); 
//     clause.textContent = ""; 
//     selected.textContent = "";
// }

// Displays and updates the user clause on the html page
// async function submitValues(event) {
//     input_button_id = event.target.id;
//     id = getButtonId(input_button_id);

//     const messageElement = document.getElementById('update_user_clause'); 
//     text = messageElement.textContent; 

//     selectElement = document.getElementById(id); 
//     input = selectElement.value; 
//     output = text + ' ' + input;
//     messageElement.textContent = output;
// }

// Helper function for submitValues():
// Given a button id, returns the id of the object where user input is stored
// function getButtonId(input_button_id){
//     id = "";
//     switch(input_button_id){
//         case 'submit_val': 
//             id = 'num_val';
//             break;
//         case 'submit_op':
//             id = 'op'
//             break;
//         case 'submit_attr':
//             id = 'attr';
//             break;
//         case 'submit_clause':
//             id = 'clause';
//             break;
//         default:
//             alert("Error!");
//             break;
//     }
//     return id;
// }

// Displays attributes user selects from table on html page
// async function selectAttributes() {
//     const messageElement = document.getElementById('update_selected_attributes');
//     text = messageElement.textContent; 

//     selectElement = document.getElementById('attributes');
//     input = selectElement.value;
//     messageElement.textContent = input;
// }

//================================================ NESTED AGGREGATION WITH GROUP BY
// Gets the result of a query with nested aggregation and group by
// Displays result to interface
async function getResultOfNestedAggreQuery() {
    //Request for reponse
    const response = await fetch("/nested-aggregation-temp-prec-hum", {
        method: 'GET'
    });

    //Check if query returned a result
    const responseData = await response.json();
    if (responseData.success) {
        alert('Query succesfully returned!');
    } else {
        alert("Error in getResultOfNestedAggreQuery()!");
    }
    
    //Display results of query:
    const displayResult = document.getElementById('result_of_nested_a_msg');
    const columns = responseData.result.metaData;
    const rows = responseData.result.rows;
    text = "";

    for(let i in columns){
        text += columns[i].name + "  ";
    }
    text += "\n";
    for(let j in rows){
        text += rows[j] + "\n";
    }
    displayResult.textContent = text;
}

//=============================================== UPDATE FOR TEMPPRECIPITATIONHUMIDITY

// Updates the value of humidity specified by user in the child table
// (specifically TempPrecipitationHumidity)
async function updateHumidityChildTable(){
    // const id = document.getElementById('temp_prec_dropdown').value; 
    const tempVal = document.getElementById('temp_val').value;
    const precVal = document.getElementById('prec_val').value; 
    const oldHum = document.getElementById('old_hum_val').value;
    const userVal = document.getElementById('new_hum_val').value;
    const response = await fetch('/update-humidity-child-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            temp: tempVal,
            prec: precVal,
            oldHumidity: oldHum,
            newHumidity: userVal
        })
    });
    const responseData = await response.json();
    const messageElement = document.getElementById('updateHumResultMsg');

    //Check if table has been updated
    if (responseData.success) {
        messageElement.textContent = "Humidity updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "ERROR: The (Temperature, Precipitation, Humidity) tuple does not exist in the table or new humidity does not already exist in the HumidityCloudCoverage table!";
    }
}

async function updateCloudCoverage(){
    const newVal = Number(document.getElementById("new_cc_val").value); 
    const humidityVal = Number(document.getElementById("cc_humidity").value); 

    const response = await fetch('/update-cloud-coverage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newCC: newVal,
            humidity: humidityVal
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateccResultMsg');

    //Check if table has been updated
    if (responseData.success) {
        messageElement.textContent = "CloudCoverage updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Specified humidity does not exist!";
    }
}

//=============================================== UPDATE CLOUDCOVERAGEANDPRECIPITATION
// Updates humidity in the CloudCoverage as well as any referencing children in the TempPrecipitationHumidity.

// This function models ON UPDATE CASCADE:
async function updateHumidityParentTable(){
    const oldVal = parseInt(document.getElementById("updateOldHumidity").value);
    const newVal = parseInt(document.getElementById("updateNewHumidity").value); 

    const response = await fetch('/update-humidity-parent-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldHumidity: oldVal,
            newHumidity: newVal
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateParentResultMsg');

    //Check if table has been updated
    if (responseData.success) {
        messageElement.textContent = "Humidity updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating Humidity!";
    }
}

// selects from TempPrecipitationHumidity tuples where humidity = val
// and returns them 
async function selectFromTempPrecipitationHumidity(val){
    //Send the query:
    const response = await fetch("/select-from-temp-prec-hum", {
        method: 'POST', //sending data
        headers: { //specifies what type of data is sending
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({//actual data need to send
            value: val
        })
    });

    //Check if sending the query was successful: 
    const responseData = await response.json();

    if (responseData.success) {
        alert(`Success! Query to TempPrecipitationHumidity succeeded!`);
    }else{
        alert(`Error! Query to TempPrecipitationHumidity failed`);
    }
    //Return the result of the query
    return responseData.result;
}


async function avgTemperature(event) {
    event.preventDefault();
    
    const temperatureValue = document.getElementById("temperatureValue").value;
    const humidityValue = document.getElementById("humidityValue").value;

    const response = await fetch(`/avg-temp?temperature=${temperatureValue}&humidity=${humidityValue}`);
    
    if (response.ok) {
        const responseData = await response.json();
        const messageElement = document.getElementById('avgResultMsg');
        messageElement.textContent = "Average performed successfully!";
        const avgTemperatures = responseData.data;

        const tableBody = document.getElementById("avgTempTable").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ''; 

        avgTemperatures.forEach(row => {
            const newRow = tableBody.insertRow();
            const humidityCell = newRow.insertCell(0);
            const avgTempCell = newRow.insertCell(1);
            humidityCell.textContent = row[0]; 
            avgTempCell.textContent = row[1];  
        });
    } else {
        console.error("Error fetching data from the server");
    }
}


async function findCityCount(event) {
    event.preventDefault();

    const communityType = document.getElementById("communityType").value;

    if (communityType === '') {
        console.log("Please select a community type.");
        return;
    }

    if (communityType.toLowerCase() !== "urban" && communityType.toLowerCase() !== "rural") {
        alert(`Error! Illegal Input!`);
        return;
    }
    
    const response = await fetch(`/city-count?communityType=${communityType}`);

    if (response.ok) {
        const responseData = await response.json();
        const cityCounts = responseData.data;
       
        if (cityCounts && cityCounts.length > 0) {
            const cityCount = cityCounts[0][1]; // access the city count from the first array 
            // format is array of arrays
            document.getElementById("cityCountResult").textContent = `City Count for ${communityType}: ${cityCount}`;
            const messageElement = document.getElementById('countResultMsg');
            messageElement.textContent = "Count performed successfully!";
        } else {
            document.getElementById("cityCountResult").textContent = `No data found for ${communityType}`;
        }
    } else {
        alert("Error fetching data from the server");
        document.getElementById("cityCountResult").textContent = `Error fetching data for ${communityType}`;
    }
}

// CITE: https://www.w3schools.com/HOWTO/tryit.asp?filename=tryhow_js_tabs
// CODE IS COMPLETELY TAKEN FROM https://www.w3schools.com/w3css/w3css_tabulators.asp
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }