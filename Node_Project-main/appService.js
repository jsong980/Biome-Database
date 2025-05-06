const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM HumidityAndCloudCoverage');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute('DROP TABLE TempPrecipitationHumidity');
            await connection.execute(`DROP TABLE HumidityAndCloudCoverage`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE HumidityAndCloudCoverage (
                Humidity INTEGER NOT NULL,
                CloudCoverage FLOAT,
                PRIMARY KEY (Humidity)
            )
        `);

        await connection.execute(
            `INSERT INTO HumidityAndCloudCoverage (Humidity, CloudCoverage) 
            VALUES (90, 76)`
        );

        await connection.execute(
            `INSERT INTO HumidityAndCloudCoverage (Humidity, CloudCoverage) 
            VALUES (30, 50)`
        );

        await connection.execute(
            `INSERT INTO HumidityAndCloudCoverage (Humidity, CloudCoverage) 
            VALUES (35, 40)`
        );

        await connection.execute(
            `INSERT INTO HumidityAndCloudCoverage(Humidity, CloudCoverage) VALUES (95, 30)`
        );

        await connection.execute(
            `INSERT INTO HumidityAndCloudCoverage(Humidity, CloudCoverage) VALUES (50, 10)`
        );

        await connection.execute(`
            CREATE TABLE TempPrecipitationHumidity (
                Temperature INTEGER NOT NULL, 
                Precipitation INTEGER NOT NULL, 
                Humidity INTEGER,
                PRIMARY KEY (Temperature, Precipitation),
                FOREIGN KEY (Humidity) REFERENCES HumidityAndCloudCoverage(Humidity)
                on delete cascade
            )
        `);

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(9, 300, 90)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(5, 305, 35)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(3, 200, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(2, 255, 50)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(3, 250, 50)`
        ); 

        //added extra insert statements
        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(4, 250, 35)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(5, 250, 50)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(6, 300, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(7, 200, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(18, 200, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(25, 250, 35)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(10, 305, 35)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(11, 200, 35)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(14, 305, 50)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(12, 305, 90)`
        );
        
        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(14, 255, 90)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(15, 255, 95)`
        );


        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(10, 300, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(12, 300, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(13, 255, 30)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(17, 255, 30)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(16, 255, 30)`
        );

        await connection.commit();
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO HumidityAndCloudCoverage (Humidity, CloudCoverage) 
            VALUES (:humidity, :cloudCoverage)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function fetchTempPrecipitationHumidityFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM TempPrecipitationHumidity');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateTempPrecipitationHumidity() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute('DROP TABLE TempPrecipitationHumidity');
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE TempPrecipitationHumidity (
                Temperature INTEGER NOT NULL, 
                Precipitation INTEGER NOT NULL, 
                Humidity INTEGER,
                PRIMARY KEY (Temperature, Precipitation),
                FOREIGN KEY (Humidity) REFERENCES HumidityAndCloudCoverage(Humidity)
                on delete cascade
            )
        `);

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(9, 300, 90)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(5, 305, 35)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(3, 200, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(2, 255, 50)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(3, 250, 50)`
        );

         //added extra insert statements
         await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(4, 250, 35)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(5, 250, 50)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(6, 300, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(7, 200, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(18, 200, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(25, 250, 35)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(10, 305, 35)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(11, 200, 35)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(14, 305, 50)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(12, 305, 90)`
        );
        
        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(14, 255, 90)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(15, 255, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(20, 250, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(9, 250, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(10, 300, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(12, 300, 95)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(13, 255, 30)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(17, 255, 30)`
        );

        await connection.execute(
            `INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(16, 255, 30)`
        );

        await connection.commit();
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertTempPrecipitationHumidity(temperature, precipitation, humidity) {
    return await withOracleDB(async (connection) => {
        let result;

        result = await connection.execute(
            `INSERT INTO TempPrecipitationHumidity (Temperature, Precipitation, Humidity)
            VALUES (:temperature, :precipitation, :humidity)`,
            [temperature, precipitation, humidity],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteHumidityCloud(humidity) {
    return await withOracleDB(async (connection) => {
        let result;

        result = await connection.execute(
            `DELETE FROM HumidityAndCloudCoverage 
            WHERE humidity = :humidity`,
            [humidity],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function joinVertebratesAndCirculation(hasVertebrae) {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT AnimalScientificName, v.hasVertebrae, circulationSystem
            FROM VertebratesAndInvertebrates v, CirculationSystemsOfVertebrates c 
            WHERE v.hasVertebrae = c.hasVertebrae 
            AND c.hasVertebrae = :hasVertebrae
        `;
        
        const result = await connection.execute(query, [hasVertebrae]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchNaturalDisastersDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM EnvironmentalDamageCausedByNaturalDisasters NATURAL JOIN NaturalDisastersOccurrencesInBC');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchJoinedHumidityPrecip() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT temperature, precipitation, TempPrecipitationHumidity.humidity, cloudcoverage FROM TempPrecipitationHumidity, HumidityAndCloudCoverage WHERE HumidityAndCloudCoverage.humidity = TempPrecipitationHumidity.humidity');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchVertebrates() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM VertebratesAndInvertebrates');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchCirculationSystems() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM CirculationSystemsOfVertebrates');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchCities() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM CitiesAndCommunityTypes');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateNaturalDisasters() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute('DROP TABLE EcosystemsInBC');
            await connection.execute('DROP TABLE NaturalDisastersOccurrencesInBC');
            await connection.execute('DROP TABLE EnvironmentalDamageCausedByNaturalDisasters');
            await connection.execute('DROP TABLE DistributionOfGeologicalCommodities');
            await connection.execute('DROP TABLE CitiesAndCommunityTypes');

        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        let result;

        result = await connection.execute(`
            create table CitiesAndCommunityTypes (
            CityName varchar(255) not null,
            CommunityType varchar(255) null,
            primary key (CityName)
            )
        `);

        result = await connection.execute(`
            create table DistributionOfGeologicalCommodities
            (GeologicalCommoditiesName varchar(25) not null, 
            CityName varchar(25) not null,
            LevelOfAbundance integer,
            primary key(GeologicalCommoditiesName,CityName), 
            foreign key (GeologicalCommoditiesName) references  DensitiesOfGeologicalCommodities(GeologicalCommoditiesName),
            foreign key (CityName) references CitiesAndCommunityTypes(CityName))
        `);

        result = await connection.execute(`
            create table EnvironmentalDamageCausedByNaturalDisasters (
            NaturalDisasterType char(20) not null,
            CityName varchar(255) not null, 
            AreaDamaged int null,
            primary key (NaturalDisasterType, CityName),
            foreign key (CityName) references CitiesAndCommunityTypes(CityName)
            on delete cascade
            )
        `);

        result = await connection.execute(`
            create table NaturalDisastersOccurrencesInBC(
            NaturalDisasterType char(20),
            CityName varchar(255), 
            YearOfMostRecentOccurence integer,
            primary key(NaturalDisasterType, CityName),
            foreign key(NaturalDisasterType, CityName) references EnvironmentalDamageCausedByNaturalDisasters,
            foreign key(CityName) references CitiesAndCommunityTypes on delete cascade
            )
        `);

        result = await connection.execute(`
            create table EcosystemsInBC
            (GeographicBarriersName varchar(25) not null, 
            BiomeName varchar(25) not null,
            SoilType varchar(25) not null,
            AnimalScientificName varchar(25) not null,
            PlantScientificName varchar(25) not null,
            GeologicalCommoditiesName varchar(25) not null, 
            CityName varchar(255) not null,
            NaturalDisastersType char(20) not null,
            primary key (GeographicBarriersName, BiomeName, SoilType, AnimalScientificName, PlantScientificName,
            GeologicalCommoditiesName, CityName, NaturalDisastersType),
            foreign key (GeographicBarriersName) references LengthsOfGeographicBarriers(Name),
            foreign key (BiomeName) references BiomeAndType(BiomeName),
            foreign key (SoilType) references SoilAndOxygenConcentration(SoilType),
            foreign key (AnimalScientificName) references VertebratesAndInvertebrates(AnimalScientificName),
            foreign key (PlantScientificName) references PlantsAndTheirSourcesOfEnergy(PlantScientificName),
            foreign key (GeologicalCommoditiesName, CityName) references DistributionOfGeologicalCommodities(GeologicalCommoditiesName, CityName),
            foreign key (CityName, NaturalDisastersType) references EnvironmentalDamageCausedByNaturalDisasters (CityName, NaturalDisasterType))
        `);

        await connection.execute(
            `INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Vancouver', 'Urban')`
        );
        await connection.execute(
            `INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Burnaby', 'Urban')`
        );
        await connection.execute(
            `INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Richmond', 'Urban')`
        );
        await connection.execute(
            `INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Surrey', 'Urban')`
        );
        await connection.execute(
            `INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Coquitlam', 'Urban')`
        );
        await connection.execute(
            `INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Langley', 'Urban')`
        );
        await connection.execute(
            `INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Kelowna', 'Rural')`
        );
        await connection.execute(
            `INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Nelson', 'Rural')`
        );
        await connection.execute(
            `INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Keremeos', 'Rural')`
        );
        await connection.execute(
            `INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Salmo', 'Rural')`
        );
        

        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Earthquake', 'Vancouver', 1000)`
        );
        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Earthquake', 'Burnaby', 500)`
        );
        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Earthquake', 'Kelowna', 700)`
        );
        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Fire', 'Vancouver', 500)`
        );
        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Flood', 'Vancouver', 100)`
        );
        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Flood', 'Burnaby', 2000)`
        );
        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Fire', 'Coquitlam', 200)`
        );
        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Flood', 'Richmond', 900)`
        );
        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Earthquake', 'Keremeos', 3000)`
        );
        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Flood', 'Coquitlam', 2500)`
        );
        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Tsunami', 'Vancouver', 1500)`
        );
        await connection.execute(
            `INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
            NaturalDisasterType, CityName, AreaDamaged) VALUES ('Avalanche', 'Vancouver', 200)`
        );

        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Earthquake', 'Burnaby', 2025)`
        );
        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Flood', 'Burnaby', 2025)`
        );
        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Earthquake', 'Vancouver', 2025)`
        );
        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Fire', 'Vancouver', 2024)`
        );
        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Flood', 'Vancouver', 2023)`
        );
        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Earthquake', 'Kelowna', 2023)`
        );
        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Fire', 'Coquitlam', 2022)`
        );
        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Flood', 'Richmond', 2021)`
        );
        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Earthquake', 'Keremeos', 2021)`
        );
        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Flood', 'Coquitlam', 2022)`
        );
        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Tsunami', 'Vancouver', 2021)`
        );
        await connection.execute(
            `INSERT INTO NaturalDisastersOccurrencesInBC(
            NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Avalanche', 'Vancouver', 2022)`
        );

        await connection.commit();
        return true;
    }).catch(() => {
        return false;
    });
}

async function showCityEveryYear() {
    return await withOracleDB(async (connection) => {
        const query = `
        SELECT DISTINCT CC.CityName 
        FROM CitiesAndCommunityTypes CC 
        WHERE NOT EXISTS (SELECT YearOfMostRecentOccurence FROM NaturalDisastersOccurrencesInBC 
        MINUS SELECT YearOfMostRecentOccurence FROM NaturalDisastersOccurrencesInBC CN 
        WHERE CN.CityName = CC.CityName)
        `;
        
        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function selectColumns(columns) {
    const all_attributes = columns.join(', ');

    return await withOracleDB(async (connection) => {
        const query = `
        SELECT ${all_attributes}
        FROM EnvironmentalDamageCausedByNaturalDisasters 
        NATURAL JOIN NaturalDisastersOccurrencesInBC
    `;        
        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

//==========================SELECTION: 
//Selects tuples from HumidityAndCloudCoverage given inputs 
async function selectFromHumidityAndCloudCoverage(attributes, clause) {
    query = 'SELECT ' + attributes + ' FROM HumidityAndCloudCoverage';
    
    if(clause != ""){ //case where user specifies a clause
       query +=  ' WHERE ' + clause;
    }
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return result;
    }).catch(() => {
        console.log("Oracle gave an error! In selectFromHumidityAndCloudCoverage()");
        return -1;
    });
}

//========================================== NESTED AGGREGATION WITH GROUP BY
// Sends a query requesting all humidities for which,
// the average cloud coverage is minimum over all humidities
// async function nestedAggreHumCloudCoverage(){
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(`
//             SELECT Humidity, AVG(CloudCoverage)
//             FROM HumidityAndCloudCoverage h1
//             GROUP BY Humidity
//             HAVING AVG(CloudCoverage) <= ALL(
// 	                SELECT AVG(CloudCoverage) 
// 	                FROM  HumidityAndCloudCoverage h2)
//     `);
//         return result;
//     }).catch(() => {
//         console.log("Oracle gave an error! In nestedAggreHumCloudCoverage()");
//         return -1;
//     });
// }

async function nestedAggreTempPrecHumidity(){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT tph.Precipitation, AVG(CloudCoverage)
            FROM TempPrecipitationHumidity tph 
            JOIN HumidityAndCloudCoverage h ON tph.Humidity = h.Humidity
            GROUP BY tph.Precipitation
            HAVING AVG(h.CloudCoverage) <= (
	                SELECT AVG(h2.CloudCoverage) 
	                FROM  HumidityAndCloudCoverage h2)
    `);
        return result;
    }).catch(() => {
        console.log("Oracle gave an error! In nestedAggreTempPrecHumidity()");
        return -1;
    });
}

//============================================= UPDATE TEMPPRECIPITATIONHUMIDITY
// Updates the value of humidity in a specified tuple in the child table (i.e: TempPrecipitationHumidity)
// REQUIRES: newHumidity to be a pre-existing value in HumidityAndCloudCoverage
async function updateHumidityChildTable(temp, prec, oldHumidity, newHumidity){
    return await withOracleDB(async(connection) => {
        let result;

        const checkExistence = await connection.execute(
            `SELECT * FROM TempPrecipitationHumidity 
             WHERE temperature = :temp AND precipitation = :prec AND humidity = :oldHumidity`,
            [temp, prec, oldHumidity]
        );

        if (checkExistence.rows.length === 0) {
            return false;
        }

        result = await connection.execute(`
            DELETE FROM TempPrecipitationHumidity where temperature =:temp AND precipitation = :prec AND humidity = :oldHumidity`,
            [temp, prec, oldHumidity],
            { autoCommit: true}
        );

        result = await connection.execute(`
            INSERT INTO TempPrecipitationHumidity (Temperature, Precipitation, Humidity)
            VALUES (:temp, :prec, :newHumidity)`,
            [temp, prec, newHumidity],
            { autoCommit: true}
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

//==================================== UPDATE TEMPPRECIPITATIONHUMIDITY
//Updates humidity in the parent table (i.e: HumidityAndCloudCoverage)
async function updateHumidityParentTable(oldHumidity, newHumidity) {
    //TODO:
    return await withOracleDB(async (connection) => {
        let result;
        result = await connection.execute(`
            UPDATE HumidityAndCloudCoverage
            SET humidity=:newHumidity
            WHERE humidity=:oldHumidity`,
            [newHumidity, oldHumidity],
            { autoCommit: true}
            );
        await connection.commit();
        return result.rowsAffected && result.rowsAffected > 0;        
    }).catch(() => {
        return false;
    });
}

async function updateCloudCoverage(newCC, humidity) {
    //TODO:
    return await withOracleDB(async (connection) => {
        let result;
        result = await connection.execute(`
            UPDATE HumidityAndCloudCoverage
            SET CloudCoverage=:newCC
            WHERE humidity = :humidity`,
            [newCC, humidity],
            { autoCommit: true}
            );
        await connection.commit();
        return result.rowsAffected && result.rowsAffected > 0;        
    }).catch(() => {
        return false;
    });
}

// REQUIRES: val must be prexisting value in the parent table HumidityAndCloudCoverage
// Given a val, returns all tuples with humidity = val in TempPrecipitationHumidity
async function checkIfChildrenExists(val){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT *
            FROM TempPrecipitationHumidity 
            WHERE Humidity=:val`,
            [val],
            {autoCommit: true}
        );
        return result;
    }).catch(() => {
        return false;
    });
}

async function getAverageTemperatureAboveThreshold(temperatureValue, humidityValue) {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT tph.Humidity, AVG(tph.Temperature) 
            FROM TempPrecipitationHumidity tph
            WHERE tph.Humidity > :humidity  
            GROUP BY tph.Humidity 
            HAVING AVG(tph.Temperature) > :temperature
        `;
        
        const result = await connection.execute(query, {
            humidity: humidityValue,
            temperature: temperatureValue
        });

       
        if (result.rows.length > 0) {
            return result.rows; 
        }

        return [];
    }).catch((error) => {
        console.error('Error executing the query:', error); 
        return [];  
    });
}

//https://www.w3schools.com/sql/func_sqlserver_upper.asp
async function getCityCountByCommunityType(communityType) {
    return await withOracleDB(async (connection) => {
        const query = `
            SELECT CommunityType, COUNT(CityName) 
            FROM CitiesAndCommunityTypes
            WHERE UPPER(CommunityType) = UPPER(:communityType)  
            GROUP BY CommunityType
        `;
        
        const result = await connection.execute(query, {
            communityType: communityType.toUpperCase() //format it so capitalization doesn't matter
        });

        if (result.rows.length > 0) {
            return result.rows; 
        }

        return []; 
    }).catch((error) => {
        console.error('Error executing the query:', error); 
        return [];  
    });
}


module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable,
    insertDemotable,
    fetchTempPrecipitationHumidityFromDb,
    initiateTempPrecipitationHumidity,
    insertTempPrecipitationHumidity,
    joinVertebratesAndCirculation,
    fetchNaturalDisastersDb,
    initiateNaturalDisasters,
    showCityEveryYear,
    selectColumns,
    deleteHumidityCloud, 
    selectFromHumidityAndCloudCoverage,
    nestedAggreTempPrecHumidity,
    checkIfChildrenExists,
    updateHumidityChildTable,
    updateHumidityParentTable,
    getAverageTemperatureAboveThreshold,
    getCityCountByCommunityType,
    fetchJoinedHumidityPrecip,
    updateCloudCoverage,
    fetchVertebrates,
    fetchCirculationSystems,
    fetchCities
};