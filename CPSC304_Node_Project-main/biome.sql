drop table EcosystemsInBC;
drop table LengthsOfGeographicBarriers; 
drop table VertebratesAndInvertebrates;
drop table CirculationSystemsOfVertebrates;
drop table VascularizationInPlants;
drop table PlantSpeciesAndTheirPhylums;
drop table ReproductionInPlantPhylums;
drop table AnimalsAndSourcesOfEnergy;
drop table TempPrecipitationHumidity;
drop table HumidityAndCloudCoverage;
drop table DistributionOfGeologicalCommodities;
drop table NaturalDisastersOccurrencesInBC;
drop table TemperaturesOfBiomes; 
drop table PrecipitationOfBiomes;
drop table SoilAndOxygenConcentration;
drop table BiomeAndType;
drop table OxygenConcentrationAndRedox;
drop table DensitiesOfGeologicalCommodities;
drop table PlantsAndTheirSourcesOfEnergy;
drop table EnvironmentalDamageCausedByNaturalDisasters;
drop table CitiesAndCommunityTypes;

create table BiomeAndType (
    BiomeName varchar(255) not null,
    isTerrestrial number(1) null,
    primary key (BiomeName)
);


grant select on BiomeAndType to public;


create table CitiesAndCommunityTypes (
    CityName varchar(255) not null,
    CommunityType varchar(255) null,
    primary key (CityName)
);


grant select on CitiesAndCommunityTypes to public;

create table EnvironmentalDamageCausedByNaturalDisasters (
    NaturalDisasterType char(20) not null,
    CityName varchar(255) not null, 
    AreaDamaged int null,
    primary key (NaturalDisasterType, CityName),
    foreign key (CityName) references CitiesAndCommunityTypes(CityName)
    on delete cascade
);

grant select on EnvironmentalDamageCausedByNaturalDisasters to public;

create table HumidityAndCloudCoverage
(Humidity integer not null, 
    CloudCoverage float,
    primary key (Humidity));
 
grant select on HumidityAndCloudCoverage to public;

create table TempPrecipitationHumidity (
    Temperature int not null, 
    Precipitation int not null, 
    Humidity int null, 
    primary key (Temperature, Precipitation),
    foreign key (Humidity) references HumidityAndCloudCoverage(Humidity)
    on delete cascade
);

grant select on TempPrecipitationHumidity to public;

create table AnimalsAndSourcesOfEnergy (
    AnimalScientificName varchar(255) not null, 
    SourceOfEnergy varchar(255) null,
    primary key (AnimalScientificName)
);

grant select on AnimalsAndSourcesOfEnergy to public;

create table ReproductionInPlantPhylums
(Phylum varchar(20) not null,
Reproduction char(10),
primary key (Phylum));

grant select on ReproductionInPlantPhylums to public;


create table VascularizationInPlants (
    Phylum varchar(255) not null, 
    Vascularization char(11) null, 
    primary key (Phylum),
    foreign key (Phylum) references ReproductionInPlantPhylums(Phylum)
    on delete cascade
);

grant select on VascularizationInPlants to public;

create table CirculationSystemsOfVertebrates
(hasVertebrae number(1) not null, 
circulationSystem varchar(10),
primary key(hasVertebrae));

grant select on CirculationSystemsOfVertebrates to public;

create table VertebratesAndInvertebrates (
    AnimalScientificName varchar(255) not null,
    hasVertebrae number(1) null,
    primary key (AnimalScientificName),
    foreign key (hasVertebrae) references CirculationSystemsOfVertebrates(hasVertebrae)
    on delete cascade
);

grant select on VertebratesAndInvertebrates to public;

create table LengthsOfGeographicBarriers
    (name varchar(40) not null, 
     length integer, 
     primary key (name));

grant select on LengthsOfGeographicBarriers to public;

create table OxygenConcentrationAndRedox
    (OxygenConcentration float not null, 
    redoxPotential varchar(40) null, 
    primary key(oxygenConcentration));

grant select on OxygenConcentrationAndRedox to public;

create table DensitiesOfGeologicalCommodities 
    (GeologicalCommoditiesName  varchar(40) not null, 
    Density number(10, 2) null,
    primary key(GeologicalCommoditiesName));

grant select on DensitiesOfGeologicalCommodities to public;

--Tables we expect an error since the referenced tables were not created nor instantiated: 
create table TemperaturesOfBiomes(
    Name varchar(40) not null, 
    Temperature int not null, 
    primary key(Name), 
    foreign key(Name) references BiomeAndType
    on delete cascade);

grant select on TemperaturesOfBiomes to public; 

create table PrecipitationOfBiomes
(BiomeName varchar(25) not null, 
Precipitation integer,
primary key(BiomeName), 
foreign key (BiomeName) references BiomeAndType(BiomeName)
on delete cascade);

grant select on PrecipitationOfBiomes to public;

create table SoilAndOxygenConcentration
(SoilType varchar(25) not null, 
OxygenConcentration float,
primary key(SoilType), 
foreign key (OxygenConcentration) references OxygenConcentrationAndRedox(OxygenConcentration)
on delete cascade);

grant select on SoilAndOxygenConcentration to public;

create table PlantSpeciesAndTheirPhylums(
PlantScientificName varchar(255),
Phylum varchar(255), 
primary key(PlantScientificName),
foreign key(Phylum) references ReproductionInPlantPhylums
on delete cascade
);

grant select on PlantSpeciesAndTheirPhylums to public;

CREATE TABLE PlantsAndTheirSourcesOfEnergy(
PlantScientificName varchar(255), 
SourceofEnergy varchar(255),
primary key(PlantScientificName)
);

grant select on PlantsAndTheirSourcesOfEnergy to public;


create table NaturalDisastersOccurrencesInBC(
NaturalDisasterType char(20),
CityName varchar(255), 
YearOfMostRecentOccurence integer,
primary key(NaturalDisasterType, CityName),
foreign key(NaturalDisasterType, CityName) references EnvironmentalDamageCausedByNaturalDisasters on delete cascade,
foreign key(CityName) references CitiesAndCommunityTypes on delete cascade
);

grant select on NaturalDisastersOccurrencesInBC to public;


create table DistributionOfGeologicalCommodities
(GeologicalCommoditiesName varchar(25) not null, 
CityName varchar(25) not null,
LevelOfAbundance integer,
primary key(GeologicalCommoditiesName,CityName), 
foreign key (GeologicalCommoditiesName) references  DensitiesOfGeologicalCommodities(GeologicalCommoditiesName) on delete cascade,
foreign key (CityName) references CitiesAndCommunityTypes(CityName) on delete cascade);

grant select on DistributionOfGeologicalCommodities to public;

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
foreign key (GeographicBarriersName) references LengthsOfGeographicBarriers(Name) on delete cascade,
foreign key (BiomeName) references BiomeAndType(BiomeName) on delete cascade,
foreign key (SoilType) references SoilAndOxygenConcentration(SoilType) on delete cascade,
foreign key (AnimalScientificName) references VertebratesAndInvertebrates(AnimalScientificName) on delete cascade,
foreign key (PlantScientificName) references PlantsAndTheirSourcesOfEnergy(PlantScientificName) on delete cascade,
foreign key (GeologicalCommoditiesName, CityName) references DistributionOfGeologicalCommodities(GeologicalCommoditiesName, CityName) on delete cascade,
foreign key (CityName, NaturalDisastersType) references EnvironmentalDamageCausedByNaturalDisasters (CityName, NaturalDisasterType) on delete cascade);

grant select on EcosystemsInBC to public;

INSERT INTO CirculationSystemsOfVertebrates (hasVertebrae, circulationSystem) VALUES (1, 'Closed');
INSERT INTO CirculationSystemsOfVertebrates(hasVertebrae, circulationSystem) VALUES (0, 'Open');
INSERT INTO VertebratesAndInvertebrates(AnimalScientificName, hasVertebrae) VALUES ('Canis latrans', 1);
INSERT INTO VertebratesAndInvertebrates(AnimalScientificName, hasVertebrae) VALUES ('Canis lupus', 1);
INSERT INTO VertebratesAndInvertebrates(AnimalScientificName, hasVertebrae) VALUES ('Vulpes vulpes', 1); 
INSERT INTO VertebratesAndInvertebrates(AnimalScientificName, hasVertebrae) VALUES ('Apis mellifera', 0); 
INSERT INTO VertebratesAndInvertebrates(AnimalScientificName, hasVertebrae) VALUES ('Octopus vulgaris', 0); 

INSERT INTO HumidityAndCloudCoverage(Humidity, CloudCoverage) VALUES (90, 76);
INSERT INTO HumidityAndCloudCoverage(Humidity, CloudCoverage) VALUES(30, 50);
INSERT INTO HumidityAndCloudCoverage(Humidity, CloudCoverage) VALUES(35, 40);
INSERT INTO HumidityAndCloudCoverage(Humidity, CloudCoverage) VALUES(95, 30);
INSERT INTO HumidityAndCloudCoverage(Humidity, CloudCoverage) VALUES(50, 10);

INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(9, 300, 90);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(5, 305, 35); 
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(3, 200, 95); 
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(2, 255, 50); 
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(3, 250, 50); 
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(4, 250, 35);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(5, 250, 50);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(6, 300, 95);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(7, 200, 95);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(18, 200, 95);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(25, 250, 35);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(10, 305, 35);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(11, 200, 35);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(14, 305, 50);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(12, 305, 90);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(14, 255, 90);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(15, 255, 95);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(20, 250, 95);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(9, 250, 95);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(10, 300, 95);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(12, 300, 95);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(13, 255, 30);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(17, 255, 30);
INSERT INTO TempPrecipitationHumidity(Temperature, Precipitation, Humidity) VALUES(16, 255, 30);

INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Vancouver', 'Urban');
INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Burnaby', 'Urban');
INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Richmond', 'Urban');
INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Surrey', 'Urban');
INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Coquitlam', 'Urban');
INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Langley', 'Urban');
INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Kelowna', 'Rural');
INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Nelson', 'Rural');
INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES('Keremeos', 'Rural');
INSERT INTO CitiesAndCommunityTypes(CityName, CommunityType) VALUES ('Salmo', 'Rural');




INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Earthquake', 'Vancouver', 1000);
INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Earthquake', 'Burnaby', 500);
INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Earthquake', 'Kelowna', 700);
INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Fire', 'Vancouver', 500);
INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Flood', 'Vancouver', 100);
INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Flood', 'Burnaby', 2000);


INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Fire', 'Coquitlam', 200);
INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Flood', 'Richmond', 900);
INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Earthquake', 'Keremeos', 3000);
INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Flood', 'Coquitlam', 2500);
INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Tsunami', 'Vancouver', 1500);
INSERT INTO EnvironmentalDamageCausedByNaturalDisasters(
NaturalDisasterType, CityName, AreaDamaged) VALUES ('Avalanche', 'Vancouver', 200);

INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Earthquake', 'Burnaby', 2025);
INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Flood', 'Burnaby', 2025);
INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Earthquake', 'Vancouver', 2025);
INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Fire', 'Vancouver', 2024);
INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Flood', 'Vancouver', 2023);
INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Earthquake', 'Kelowna', 2023);
    
INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Fire', 'Coquitlam', 2022);
INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Flood', 'Richmond', 2021);
INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Earthquake', 'Keremeos', 2021);
INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Flood', 'Coquitlam', 2022);
INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Tsunami', 'Vancouver', 2021);
INSERT INTO NaturalDisastersOccurrencesInBC(
    NaturalDisasterType, CityName, YearOfMostRecentOccurence) VALUES ('Avalanche', 'Vancouver', 2022);

INSERT INTO LengthsOfGeographicBarriers(Name, Length) VALUES('Canadian Rockies', 1460);
INSERT INTO LengthsOfGeographicBarriers(Name, Length) VALUES('Coast Mountains', 1600);
INSERT INTO LengthsOfGeographicBarriers(Name, Length) VALUES('Fraser River', 1375);
INSERT INTO LengthsOfGeographicBarriers(Name, Length) VALUES('Skeena River', 570);
INSERT INTO LengthsOfGeographicBarriers(Name, Length) VALUES('Okanagan Lake', 135);

INSERT INTO BiomeAndType(BiomeName, isTerrestrial) VALUES('Boreal Forest', 1);
INSERT INTO  BiomeAndType(BiomeName, isTerrestrial)VALUES('Alpine Tundra', 1);
INSERT INTO  BiomeAndType(BiomeName, isTerrestrial) VALUES('Interior Rainforest', 1);
INSERT INTO  BiomeAndType(BiomeName, isTerrestrial) VALUES('Lake', 0);
INSERT INTO  BiomeAndType(BiomeName, isTerrestrial) VALUES('River', 0);
INSERT INTO BiomeAndType(BiomeName, isTerrestrial) VALUES('Coastal Rainforest', 1);
INSERT INTO BiomeAndType(BiomeName, isTerrestrial) VALUES('Grasslands', 1);

INSERT INTO TemperaturesOfBiomes(Name, Temperature) VALUES('Coastal Rainforest', 9);
INSERT INTO  TemperaturesOfBiomes(Name, Temperature) VALUES('Grasslands', 17);
INSERT INTO TemperaturesOfBiomes(Name, Temperature) VALUES('Boreal Forest', 4);
INSERT INTO  TemperaturesOfBiomes(Name, Temperature) VALUES('Alpine Tundra', -5);
INSERT INTO  TemperaturesOfBiomes(Name, Temperature) VALUES('Interior Rainforest', 8);

INSERT INTO PrecipitationOfBiomes(BiomeName, Precipitation) VALUES('Coastal Rainforest', 300);
INSERT INTO PrecipitationOfBiomes(BiomeName, Precipitation) VALUES('Grasslands', 25);
INSERT INTO PrecipitationOfBiomes(BiomeName, Precipitation) VALUES('Boreal Forest', 50);
INSERT INTO PrecipitationOfBiomes(BiomeName, Precipitation) VALUES('Alpine Tundra', 30);
INSERT INTO PrecipitationOfBiomes(BiomeName, Precipitation) VALUES('Interior Rainforest', 100);

INSERT INTO OxygenConcentrationAndRedox(OxygenConcentration, redoxPotential) VALUES (2.0, 'LOW');
INSERT INTO OxygenConcentrationAndRedox(OxygenConcentration, redoxPotential) VALUES (10.0, 'MEDIUM');
INSERT INTO OxygenConcentrationAndRedox(OxygenConcentration, redoxPotential) VALUES (40.0, 'HIGH');
INSERT INTO OxygenConcentrationAndRedox(OxygenConcentration, redoxPotential) VALUES (50.0, 'HIGH');
INSERT INTO OxygenConcentrationAndRedox(OxygenConcentration, redoxPotential) VALUES (25.0, 'HIGH');

INSERT INTO SoilAndOxygenConcentration(SoilType, OxygenConcentration) VALUES ('Clay', 2.0);
INSERT INTO SoilAndOxygenConcentration(SoilType, OxygenConcentration) VALUES ('Silt', 10.0);
INSERT INTO SoilAndOxygenConcentration(SoilType, OxygenConcentration) VALUES ('Loam', 40.0);
INSERT INTO SoilAndOxygenConcentration(SoilType, OxygenConcentration) VALUES ('Peat', 50.0);
INSERT INTO SoilAndOxygenConcentration(SoilType, OxygenConcentration) VALUES ('Sandy Loam', 50.0);

INSERT INTO DensitiesOfGeologicalCommodities(GeologicalCommoditiesName, Density) VALUES ('Granite', 2.58);
INSERT INTO DensitiesOfGeologicalCommodities(GeologicalCommoditiesName, Density) VALUES ('Limestone', 2.70);
INSERT INTO DensitiesOfGeologicalCommodities(GeologicalCommoditiesName, Density) VALUES ('Marble', 2.67);
INSERT INTO DensitiesOfGeologicalCommodities(GeologicalCommoditiesName, Density) VALUES ('Slate', 2.79);
INSERT INTO DensitiesOfGeologicalCommodities(GeologicalCommoditiesName, Density) VALUES ('Sandstone', 2.28);

INSERT INTO DistributionOfGeologicalCommodities(GeologicalCommoditiesName, CityName, LevelOfAbundance) VALUES ('Granite', 'Richmond', 4);
INSERT INTO DistributionOfGeologicalCommodities(GeologicalCommoditiesName, CityName, LevelOfAbundance) VALUES ('Limestone', 'Langley', 4);
INSERT INTO DistributionOfGeologicalCommodities(GeologicalCommoditiesName, CityName, LevelOfAbundance) VALUES ('Slate', 'Burnaby', 3);
INSERT INTO DistributionOfGeologicalCommodities(GeologicalCommoditiesName, CityName, LevelOfAbundance) VALUES ('Sandstone', 'Surrey', 2);
INSERT INTO DistributionOfGeologicalCommodities(GeologicalCommoditiesName, CityName, LevelOfAbundance) VALUES ('Marble', 'Salmo', 1);

INSERT INTO AnimalsAndSourcesOfEnergy (AnimalScientificName, SourceofEnergy) VALUES ('Canis latrans', 'Omnivore');
INSERT INTO AnimalsAndSourcesOfEnergy (AnimalScientificName, SourceofEnergy) VALUES ('Canis lupus', 'Carnivore');
INSERT INTO AnimalsAndSourcesOfEnergy (AnimalScientificName, SourceofEnergy) VALUES ('Vulpes vulpes', 'Omnivore');
INSERT INTO AnimalsAndSourcesOfEnergy (AnimalScientificName, SourceofEnergy) VALUES ('Odocoileus virginianus', 'Herbivore');
INSERT INTO AnimalsAndSourcesOfEnergy (AnimalScientificName, SourceofEnergy) VALUES ('Urocitellus parryii', 'Herbivore');

INSERT INTO PlantsAndTheirSourcesOfEnergy(PlantScientificName, SourceofEnergy) VALUES ('Adiantum pedatum', 'Phototroph');
INSERT INTO PlantsAndTheirSourcesOfEnergy(PlantScientificName, SourceofEnergy) VALUES ('Allium cernuum', 'Phototroph');
INSERT INTO PlantsAndTheirSourcesOfEnergy(PlantScientificName, SourceofEnergy) VALUES ('Aquilegia formosa', 'Phototroph');
INSERT INTO PlantsAndTheirSourcesOfEnergy(PlantScientificName, SourceofEnergy) VALUES ('Calochortus lyallii', 'Phototroph');
INSERT INTO PlantsAndTheirSourcesOfEnergy(PlantScientificName, SourceofEnergy) VALUES ('Cimicifuga elata', 'Phototroph');

INSERT INTO ReproductionInPlantPhylums(Phylum, Reproduction) VALUES ('Bryophyta', 'Spores');
INSERT INTO ReproductionInPlantPhylums(Phylum, Reproduction) VALUES ('Coniferophyta', 'Seeds');
INSERT INTO ReproductionInPlantPhylums(Phylum, Reproduction) VALUES ('Ginkgophyta', 'Seeds');
INSERT INTO ReproductionInPlantPhylums(Phylum, Reproduction) VALUES ('Pteridophyta', 'Spores');
INSERT INTO ReproductionInPlantPhylums(Phylum, Reproduction) VALUES ('Cycadophyta', 'Seeds');
INSERT INTO ReproductionInPlantPhylums(Phylum, Reproduction) VALUES ('Anthophyta', 'Seeds');

INSERT INTO VascularizationInPlants(Phylum, Vascularization) VALUES ('Bryophyta', 'Nonvascular');
INSERT INTO VascularizationInPlants(Phylum, Vascularization) VALUES ('Coniferophyta', 'Vascular');
INSERT INTO VascularizationInPlants(Phylum, Vascularization) VALUES ('Ginkgophyta', 'Vascular');
INSERT INTO VascularizationInPlants(Phylum, Vascularization) VALUES ('Pteridophyta', 'Vascular');
INSERT INTO VascularizationInPlants(Phylum, Vascularization) VALUES ('Cycadophyta', 'Vascular');

INSERT INTO PlantSpeciesAndTheirPhylums(PlantScientificName, Phylum) VALUES ('Adiantum pedatum', 'Pteridophyta');
INSERT INTO PlantSpeciesAndTheirPhylums(PlantScientificName, Phylum) VALUES ('Allium cernuum', 'Coniferophyta' );
INSERT INTO PlantSpeciesAndTheirPhylums(PlantScientificName, Phylum) VALUES ('Aquilegia formosa', 'Anthophyta' );
INSERT INTO PlantSpeciesAndTheirPhylums(PlantScientificName, Phylum) VALUES ('Calochortus lyallii', 'Anthophyta');
INSERT INTO PlantSpeciesAndTheirPhylums(PlantScientificName, Phylum) VALUES ('Cimicifuga elata', 'Pteridophyta');

INSERT INTO EcosystemsInBC
  (GeographicBarriersName, BiomeName, SoilType, AnimalScientificName, PlantScientificName, GeologicalCommoditiesName, CityName, NaturalDisastersType)
VALUES 
  ('Canadian Rockies', 'Boreal Forest', 'Loam', 'Canis latrans', 'Aquilegia formosa', 'Granite', 'Richmond', 'Flood');

  INSERT INTO EcosystemsInBC
  (GeographicBarriersName, BiomeName, SoilType, AnimalScientificName, PlantScientificName, GeologicalCommoditiesName, CityName, NaturalDisastersType)
VALUES 
  ('Coast Mountains', 'Alpine Tundra', 'Peat', 'Canis lupus', 'Cimicifuga elata', 'Slate', 'Burnaby', 'Earthquake');

  INSERT INTO EcosystemsInBC
  (GeographicBarriersName, BiomeName, SoilType, AnimalScientificName, PlantScientificName, GeologicalCommoditiesName, CityName, NaturalDisastersType)
VALUES ('Fraser River', 'Coastal Rainforest', 'Silt', 'Vulpes vulpes', 'Calochortus lyallii', 'Granite', 'Richmond', 'Flood');

  INSERT INTO EcosystemsInBC
  (GeographicBarriersName, BiomeName, SoilType, AnimalScientificName, PlantScientificName, GeologicalCommoditiesName, CityName, NaturalDisastersType)
VALUES 
  ('Skeena River', 'Interior Rainforest', 'Clay', 'Canis lupus', 'Allium cernuum', 'Slate', 'Burnaby', 'Flood');

  INSERT INTO EcosystemsInBC
  (GeographicBarriersName, BiomeName, SoilType, AnimalScientificName, PlantScientificName, GeologicalCommoditiesName, CityName, NaturalDisastersType)
VALUES 
  ('Canadian Rockies', 'Grasslands', 'Sandy Loam', 'Canis lupus', 'Allium cernuum', 'Granite', 'Richmond', 'Flood');