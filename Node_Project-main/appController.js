const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/vertebrates', async (req, res) => {
    const tableContent = await appService.fetchVertebrates();
    res.json({data: tableContent});
});

router.get('/circulation-systems', async (req, res) => {
    const tableContent = await appService.fetchCirculationSystems();
    res.json({data: tableContent});
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.get('/joined-humidity-precip', async (req, res) => {
    const tableContent = await appService.fetchJoinedHumidityPrecip();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/temp-precipitation-humidity', async (req, res) => {
    const tableContent = await appService.fetchTempPrecipitationHumidityFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-temp-precipitation-humidity", async (req, res) => {
    const initiateResult = await appService.initiateTempPrecipitationHumidity();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-temp-precipitation-humidity", async (req, res) => {
    const { temperature, precipitation, humidity } = req.body;
    const insertResult = await appService.insertTempPrecipitationHumidity(temperature, precipitation, humidity);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-humidity-cloud", async (req, res) => {
    const {humidity} = req.body;
    const deleteResult = await appService.deleteHumidityCloud(humidity);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/reset-temp-precipitation-humidity", async (req, res) => {
    const resetResult = await appService.initiateTempPrecipitationHumidity();
    if (resetResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/reset-temp-precipitation-humidity", async (req, res) => {
    const resetResult = await appService.initiateTempPrecipitationHumidity();
    if (resetResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/join-vertebrates-circulation', async (req, res) => {
    const hasVertebrae = req.query.hasVertebrae;
    const joinData = await appService.joinVertebratesAndCirculation(hasVertebrae);

    res.json({
        data: joinData
    });
});

router.get('/select-columns', async (req, res) => {
    // CITE: UBC310 for decoding base64 string
    const column_names = JSON.parse(decodeURIComponent(req.query.column_names));
    const selectData = await appService.selectColumns(column_names);

    res.json({
        data: selectData
    });
});

router.get('/naturaldisasters', async (req, res) => {
    const tableContent = await appService.fetchNaturalDisastersDb();
    res.json({data: tableContent});
});

router.get('/cities', async (req, res) => {
    const tableContent = await appService.fetchCities();
    res.json({data: tableContent});
});

router.post("/initiate-natural-disasters", async (req, res) => {
    const initiateResult = await appService.initiateNaturalDisasters();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/city-name-division', async (req, res) => {
    const divisionData = await appService.showCityEveryYear();

    res.json({
        data: divisionData
    });
});

//============================= SELECTION
router.post('/select-from-hum-cloud-cov', async (req, res) => {
    const {attributes, clause} = req.body;
    const queryResult = await appService.selectFromHumidityAndCloudCoverage(attributes, clause);
    if(queryResult != -1){
        res.json({
            success: true,
            result: queryResult
        });
    } else {
        res.status(500).json({
            success: false,
            result: queryResult
        });
    }
});

//========================================== NESTED AGGREGATION WITH GROUP BY
//Router for getting result of a query with nested aggregation with group by
router.get('/nested-aggregation-temp-prec-hum', async (req,res) => {
    //Requests for result:
    const queryResult = await appService.nestedAggreTempPrecHumidity(); 

    //Checks if request was fulfilled:
    if(queryResult != -1){
        res.json({
            success: true,
            result: queryResult
        }); 
    }else{
        res.status(500).json({
            success: false,
            result: queryResult
        });
    } 
});

//=================================================== UPDATE TEMPPRECIPITATIONHUMIDITY:
//router for updating humidity in the child table:
router.post("/update-humidity-child-table", async (req, res) => {
    const {temp, prec, oldHumidity, newHumidity} = req.body; 
    const updateResult = await appService.updateHumidityChildTable(temp, prec, oldHumidity, newHumidity); 
    if(updateResult){
        res.json({ success: true});
    } else {
        res.status(500).json({ success: false});
    }
});

//=================================================== UPDATE HUMIDITYANDCLOUDCOVERAGE: 
//router for updating cloud coverage
router.post("/update-cloud-coverage", async (req, res) => {
    const {newCC, humidity} = req.body;
    const updateResult = await appService.updateCloudCoverage(newCC, humidity);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//=================================================== UPDATE HUMIDITYANDCLOUDCOVERAGE: 
//router for updating humidity in the parent table
router.post("/update-humidity-parent-table", async (req, res) => {
    const {oldHumidity, newHumidity } = req.body;
    const updateResult = await appService.updateHumidityParentTable(oldHumidity, newHumidity);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

//routers for the helpers:
router.post('/select-from-temp-prec-hum', async (req, res) => {
    const {value} = req.body;
    const queryResult = await appService.checkIfChildrenExists(value);
    if(queryResult != -1){
        res.json({
            success: true,
            result: queryResult
        });
    } else {
        res.status(500).json({
            success: false,
            result: queryResult
        });
    }
});

router.get("/avg-temp", async (req, res) => {
    const { temperature, humidity } = req.query;

    try {
        const avgTemperature = await appService.getAverageTemperatureAboveThreshold(temperature, humidity);        
        res.json({
            data: avgTemperature
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});


router.get("/city-count", async (req, res) => {
    const { communityType } = req.query;

    try {
        const cityCount = await appService.getCityCountByCommunityType(communityType);
        res.json({
            data: cityCount
        });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});




module.exports = router;