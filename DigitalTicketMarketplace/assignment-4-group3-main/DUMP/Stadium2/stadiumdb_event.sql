-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: stadiumdb
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `eventID` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `basePrice` decimal(10,2) DEFAULT NULL,
  `stadiumID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`eventID`),
  KEY `stadiumID` (`stadiumID`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`stadiumID`) REFERENCES `stadium` (`stadiumID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES ('EVC01458','Worldbeat Wonderland Showcase','2024-11-11',133.45,'STAD0111'),('EVC01474','Serene Strings Serenade','2024-11-09',97.44,'STAD0111'),('EVC01495','Panorama Melody Jamboree','2025-02-16',94.11,'STAD0111'),('EVC02459','Smooth Jazz Bonanza','2026-07-10',25.66,'STAD0222'),('EVC02475','Electronic Enigma Encounter','2027-06-04',63.11,'STAD0222'),('EVC02497','Vintage Vibes Fiesta','2027-04-22',194.62,'STAD0222'),('EVC02506','Rap Lyric Oasis','2025-01-08',43.97,'STAD0222'),('EVC03451','Elegant Euphony Mingle','2024-07-17',120.26,'STAD0333'),('EVC03517','Legends Live Bonfire','2024-03-22',195.97,'STAD0333'),('EVC03536','Urban Rhythmic Hustle','2027-04-20',31.31,'STAD0333'),('EVC04456','Neon Nights Rally','2024-03-30',152.35,'STAD0444'),('EVC04466','Acoustic Aura Gathering','2027-09-28',110.60,'STAD0444'),('EVC04471','Global Groove Melody','2024-06-30',103.70,'STAD0444'),('EVC04483','Country Cornucopia Roundup','2025-07-14',23.96,'STAD0444'),('EVC04523','Electronic Enigma Festival','2027-07-02',167.52,'STAD0444'),('EVC04527','Rock Revolution Bonanza','2027-10-23',146.90,'STAD0444'),('EVC04539','Cultural Rhythms Haven','2024-01-25',31.24,'STAD0444'),('EVC05508','Techno Transcendence Experience','2025-09-29',114.13,'STAD0555'),('EVC06461','Electronic Enigma Labyrinth','2027-01-16',162.01,'STAD0666'),('EVC06492','Rock Revolution Affair','2025-04-25',30.99,'STAD0666'),('EVC06519','Global Groove Blitz','2023-12-17',37.93,'STAD0666'),('EVC07467','Neon Nights Gathering','2026-03-10',183.62,'STAD0777'),('EVC07502','Bass Beat Tunes','2026-02-25',119.17,'STAD0777'),('EVC08487','Symphony Splendor Transcendence','2024-05-11',183.14,'STAD0888'),('EVC08490','Nostalgia Notes Fest','2026-12-30',157.70,'STAD0888'),('EVC08496','Vintage Vibes Carnival','2024-08-19',116.30,'STAD0888'),('EVC08514','Urban Rhythmic Spectacle','2027-01-25',93.53,'STAD0888'),('EVC08524','Whimsical Woodland Affair','2026-11-06',110.55,'STAD0888'),('EVC09457','Elegant Euphony Rally','2025-06-07',47.47,'STAD0999'),('EVC09500','Rap Lyric Festival','2027-09-14',166.96,'STAD0999'),('EVC09501','Acoustic Aura Immersion','2025-02-15',198.21,'STAD0999'),('EVC09513','Legends Live Voyage','2025-07-16',63.48,'STAD0999'),('EVC09528','Baroque Bliss Legacy','2025-10-28',74.21,'STAD0999'),('EVC09529','Stellar Soundwave Roundup','2024-11-22',102.50,'STAD0999'),('EVC09533','Rap Lyric Blitz','2026-10-04',35.47,'STAD0999'),('EVC10521','Jazzy Twilight Rendezvous','2027-01-18',26.82,'STAD1000'),('EVO02484','User-centric 24/7 hardware event','2027-06-29',172.17,'STAD0222'),('EVO04465','Reduced motivating complexity event','2025-11-08',89.12,'STAD0444'),('EVO04526','Switchable full-range infrastructure event','2027-01-23',131.10,'STAD0444'),('EVO05445','Fully-configurable zero tolerance function event','2027-05-19',85.41,'STAD0555'),('EVO05504','Distributed systemic ability event','2025-09-05',172.32,'STAD0555'),('EVO08478','Organized analyzing installation event','2026-11-27',58.06,'STAD0888'),('EVO08534','Networked human-resource matrix event','2026-05-11',52.91,'STAD0888'),('EVO09472','Self-enabling fresh-thinking access event','2026-04-10',102.79,'STAD0999'),('EVO10522','Synergized actuating moderator event','2023-11-25',140.93,'STAD1000'),('EVO10537','Digitized background algorithm event','2026-02-12',33.75,'STAD1000'),('EVS01447','Ignite evening Soccer','2025-07-21',66.34,'STAD0111'),('EVS01460','Strive tax Soccer','2026-04-03',80.61,'STAD0111'),('EVS01482','Quasar help Basketball','2025-10-05',159.10,'STAD0111'),('EVS02507','Zenith never Volleyball','2026-09-02',58.42,'STAD0222'),('EVS02538','Prowess maybe Baseball','2026-01-19',183.34,'STAD0222'),('EVS02540','Prime turn Volleyball','2026-07-08',110.88,'STAD0222'),('EVS03454','Zenith choice Hockey','2027-09-10',139.83,'STAD0333'),('EVS03488','Extreme police Rugby','2026-07-17',168.77,'STAD0333'),('EVS03494','Supersonic economic Volleyball','2025-11-16',176.15,'STAD0333'),('EVS03509','Vivid air Hockey','2027-11-13',92.57,'STAD0333'),('EVS04453','Extreme to Tennis','2026-09-04',152.71,'STAD0444'),('EVS04518','Pinnacle production Baseball','2026-06-13',145.75,'STAD0444'),('EVS05462','Apex camera Tennis','2026-08-29',182.91,'STAD0555'),('EVS05520','Adrenaline sure Hockey','2026-04-12',97.98,'STAD0555'),('EVS06486','Intense difficult Football','2025-01-24',158.99,'STAD0666'),('EVS06489','Dynamic Mr Baseball','2027-05-14',146.19,'STAD0666'),('EVS07473','Blitz president Soccer','2025-12-12',143.05,'STAD0777'),('EVS07499','Blitz throughout Hockey','2027-11-07',164.59,'STAD0777'),('EVS07511','Prowess board Soccer','2025-07-25',72.83,'STAD0777'),('EVS07541','Rapid read Basketball','2024-10-18',143.56,'STAD0777'),('EVS07543','Supersonic add Baseball','2023-12-21',69.10,'STAD0777'),('EVS08446','Thrill on Football','2026-06-09',95.19,'STAD0888'),('EVS08449','Ignite usually Rugby','2027-10-16',183.45,'STAD0888'),('EVS08479','Momentum choice Tennis','2023-12-04',121.83,'STAD0888'),('EVS08503','Velocity single Soccer','2027-05-26',132.13,'STAD0888'),('EVS08516','Apex then Football','2025-10-09',107.64,'STAD0888'),('EVS08532','Strive argue Hockey','2026-07-18',80.92,'STAD0888'),('EVS09469','Zenith establish Tennis','2025-05-03',23.40,'STAD0999'),('EVS09481','Vortex nice Rugby','2023-11-23',174.16,'STAD0999'),('EVS09498','Nebula and Volleyball','2025-11-05',133.87,'STAD0999'),('EVS09530','Pinnacle generation Baseball','2026-09-19',178.88,'STAD0999'),('EVS10476','Strive later Basketball','2024-12-30',99.11,'STAD1000'),('EVS10535','Dynamic clearly Soccer','2026-09-03',153.38,'STAD1000'),('EVT01444','Tech Implemented systematic adapter Conference','2024-09-07',57.88,'STAD0111'),('EVT01464','Future Switchable 24hour migration Conference','2024-12-29',89.00,'STAD0111'),('EVT03512','Future Intuitive holistic contingency Gala','2027-09-27',175.99,'STAD0333'),('EVT04491','Seasonal Profit-focused encompassing model Conference','2024-07-18',60.01,'STAD0444'),('EVT04542','Epic Fundamental impactful attitude Showcase','2025-04-05',129.82,'STAD0444'),('EVT06463','Global Open-architected responsive solution Extravaganza','2025-03-10',167.89,'STAD0666'),('EVT06468','Global Extended empowering open system Extravaganza','2026-04-13',32.88,'STAD0666'),('EVT06510','Tech Configurable 6thgeneration matrix Showcase','2025-11-17',106.45,'STAD0666'),('EVT07480','Epic Reactive even-keeled frame Showcase','2026-01-01',69.13,'STAD0777'),('EVT07485','Global Synchronized object-oriented hardware Fest','2025-10-14',22.65,'STAD0777'),('EVT07525','Seasonal Open-architected clear-thinking complexity Conference','2025-09-06',20.21,'STAD0777'),('EVT08452','Epic Inverse object-oriented knowledgebase Expo','2027-02-17',94.64,'STAD0888'),('EVT08470','Creative Diverse local encryption Expo','2024-04-25',178.01,'STAD0888'),('EVT08477','Creative Polarized clear-thinking model Showcase','2025-09-08',107.62,'STAD0888'),('EVT09448','Future Synergistic fault-tolerant process improvement Gala','2027-06-03',155.28,'STAD0999'),('EVT09493','Seasonal Visionary hybrid extranet Jamboree','2025-02-14',23.35,'STAD0999'),('EVT09505','Inspire Implemented multi-state initiative Gala','2024-07-26',109.49,'STAD0999'),('EVT09515','Innovation Robust even-keeled solution Fiesta','2027-07-19',166.32,'STAD0999'),('EVT09531','Tech Horizontal systemic Internet solution Expo','2023-12-07',180.69,'STAD0999'),('EVT10450','Global Ameliorated zero-defect Local Area Network Conference','2027-04-05',170.43,'STAD1000'),('EVT10455','Inspire Polarized bi-directional software Fiesta','2027-08-12',134.96,'STAD1000');
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-04 16:31:50
