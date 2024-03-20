-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: stadiumdb
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
-- Table structure for table `eventtype`
--

DROP TABLE IF EXISTS `eventtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventtype` (
  `eventTypeID` int NOT NULL AUTO_INCREMENT,
  `eventType` varchar(50) DEFAULT NULL,
  `eventID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`eventTypeID`),
  KEY `eventID` (`eventID`),
  CONSTRAINT `eventtype_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `event` (`eventID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventtype`
--

LOCK TABLES `eventtype` WRITE;
/*!40000 ALTER TABLE `eventtype` DISABLE KEYS */;
INSERT INTO `eventtype` VALUES (1,'Concert','EVC06492'),(3,'Tech','EVT08470'),(4,'Tech','EVT08477'),(7,'Championship','EVS09469'),(8,'Sports','EVS09469'),(11,'Championship','EVS07511'),(12,'Sports','EVS07511'),(13,'Charity and Fundraising','EVS07511'),(16,'Concert','EVC09500'),(17,'Concert','EVC05508'),(18,'Concert','EVC08524'),(19,'Concert','EVC04523'),(21,'Championship','EVS08516'),(22,'Sports','EVS08516'),(24,'Concert','EVC10521'),(27,'Concert','EVC07467'),(28,'Concert','EVC04527'),(29,'Corporate','EVT07485'),(30,'Tech','EVT07485'),(31,'Charity and Fundraising','EVT07485'),(32,'Concert','EVC04471'),(33,'Tech','EVT04491'),(34,'Sports','EVS08446'),(35,'Sports','EVS08503'),(36,'Concert','EVC06519'),(37,'Sports','EVS06489'),(39,'Tech','EVT06510'),(40,'Tech','EVT09493'),(41,'Charity and Fundraising','EVT09493'),(42,'Tech','EVT09515'),(43,'Concert','EVC09513'),(45,'Concert','EVC09457'),(46,'Charity and Fundraising','EVC09457'),(51,'Championship','EVS09481'),(52,'Sports','EVS09481'),(53,'Tech','EVT07525'),(54,'Sports','EVS05520'),(55,'Sports','EVS08532'),(57,'Concert','EVC09528'),(58,'Sports','EVS04453'),(59,'Concert','EVC04539'),(61,'Tech','EVT07480'),(62,'Charity and Fundraising','EVT07480'),(63,'Sports','EVS06486'),(64,'Concert','EVC04483'),(67,'Corporate','EVT09505'),(68,'Tech','EVT09505'),(69,'Concert','EVC09529'),(70,'Corporate','EVT10455'),(71,'Tech','EVT10455'),(75,'Tech','EVT09531'),(76,'Championship','EVS08479'),(77,'Sports','EVS08479'),(78,'Concert','EVC07502'),(79,'Concert','EVC08514'),(80,'Sports','EVS07543'),(81,'Concert','EVC06461'),(84,'Sports','EVS08449'),(85,'Tech','EVT08452'),(86,'Championship','EVS04518'),(87,'Sports','EVS04518'),(88,'Concert','EVC04456'),(89,'Sports','EVS05462'),(91,'Concert','EVC08487'),(92,'Charity and Fundraising','EVC08487'),(93,'Concert','EVC08490'),(94,'Tech','EVT06463'),(95,'Sports','EVS10535'),(96,'Tech','EVT10450'),(97,'Sports','EVS10476'),(98,'Concert','EVC09533'),(99,'Championship','EVS09498'),(100,'Sports','EVS09498'),(102,'Tech','EVT06468'),(103,'Concert','EVC08496'),(104,'Sports','EVS07473'),(105,'Charity and Fundraising','EVS07473'),(106,'Sports','EVS07541'),(107,'Concert','EVC04466'),(108,'Sports','EVS09530'),(109,'Championship','EVS07499'),(110,'Sports','EVS07499'),(111,'Concert','EVC09501'),(113,'Tech','EVT09448');
/*!40000 ALTER TABLE `eventtype` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-05 21:28:26
