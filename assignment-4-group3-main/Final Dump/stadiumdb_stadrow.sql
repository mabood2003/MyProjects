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
-- Table structure for table `stadrow`
--

DROP TABLE IF EXISTS `stadrow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stadrow` (
  `rowID` varchar(50) NOT NULL,
  `rowNumber` int DEFAULT NULL,
  `rowMultiplier` int DEFAULT NULL,
  `stadiumID` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`rowID`),
  KEY `stadiumID` (`stadiumID`),
  CONSTRAINT `stadrow_ibfk_1` FOREIGN KEY (`stadiumID`) REFERENCES `stadium` (`stadiumID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stadrow`
--

LOCK TABLES `stadrow` WRITE;
/*!40000 ALTER TABLE `stadrow` DISABLE KEYS */;
INSERT INTO `stadrow` VALUES ('RW0403',3,1,'STAD0444'),('RW0404',4,1,'STAD0444'),('RW0405',5,1,'STAD0444'),('RW0406',6,1,'STAD0444'),('RW0407',7,1,'STAD0444'),('RW0408',8,2,'STAD0444'),('RW0409',9,2,'STAD0444'),('RW0410',10,2,'STAD0444'),('RW0411',11,2,'STAD0444'),('RW0412',12,2,'STAD0444'),('RW0413',13,2,'STAD0444'),('RW0414',14,2,'STAD0444'),('RW0415',15,2,'STAD0444'),('RW0416',16,2,'STAD0444'),('RW0417',17,2,'STAD0444'),('RW0418',18,2,'STAD0444'),('RW0419',19,2,'STAD0444'),('RW0420',20,2,'STAD0444'),('RW0421',21,3,'STAD0444'),('RW0422',22,3,'STAD0444'),('RW0423',23,3,'STAD0444'),('RW0424',24,3,'STAD0444'),('RW0425',25,3,'STAD0444'),('RW0426',26,3,'STAD0444'),('RW0427',27,3,'STAD0444'),('RW0428',28,3,'STAD0444'),('RW0429',29,3,'STAD0444'),('RW0430',30,3,'STAD0444'),('RW0501',1,1,'STAD0555'),('RW0502',2,1,'STAD0555'),('RW0503',3,1,'STAD0555'),('RW0504',4,1,'STAD0555'),('RW0505',5,1,'STAD0555'),('RW0506',6,1,'STAD0555'),('RW0507',7,1,'STAD0555'),('RW0508',8,2,'STAD0555'),('RW0509',9,2,'STAD0555'),('RW0510',10,2,'STAD0555'),('RW0511',11,2,'STAD0555'),('RW0512',12,2,'STAD0555'),('RW0513',13,2,'STAD0555'),('RW0514',14,2,'STAD0555'),('RW0515',15,2,'STAD0555'),('RW0516',16,2,'STAD0555'),('RW0517',17,2,'STAD0555'),('RW0518',18,2,'STAD0555'),('RW0519',19,2,'STAD0555'),('RW0520',20,2,'STAD0555'),('RW0521',21,3,'STAD0555'),('RW0522',22,3,'STAD0555'),('RW0523',23,3,'STAD0555'),('RW0524',24,3,'STAD0555'),('RW0525',25,3,'STAD0555'),('RW0526',26,3,'STAD0555'),('RW0527',27,3,'STAD0555'),('RW0528',28,3,'STAD0555'),('RW0529',29,3,'STAD0555'),('RW0530',30,3,'STAD0555'),('RW0601',1,1,'STAD0666'),('RW0602',2,1,'STAD0666'),('RW0603',3,1,'STAD0666'),('RW0604',4,1,'STAD0666'),('RW0605',5,1,'STAD0666'),('RW0606',6,1,'STAD0666'),('RW0607',7,1,'STAD0666'),('RW0608',8,2,'STAD0666'),('RW0609',9,2,'STAD0666'),('RW0610',10,2,'STAD0666'),('RW0611',11,2,'STAD0666'),('RW0612',12,2,'STAD0666'),('RW0613',13,2,'STAD0666'),('RW0614',14,2,'STAD0666'),('RW0615',15,2,'STAD0666'),('RW0616',16,2,'STAD0666'),('RW0617',17,2,'STAD0666'),('RW0618',18,2,'STAD0666'),('RW0619',19,2,'STAD0666'),('RW0620',20,2,'STAD0666'),('RW0621',21,3,'STAD0666'),('RW0622',22,3,'STAD0666'),('RW0623',23,3,'STAD0666'),('RW0624',24,3,'STAD0666'),('RW0625',25,3,'STAD0666'),('RW0626',26,3,'STAD0666'),('RW0627',27,3,'STAD0666'),('RW0628',28,3,'STAD0666'),('RW0629',29,3,'STAD0666'),('RW0630',30,3,'STAD0666'),('RW0701',1,1,'STAD0777'),('RW0702',2,1,'STAD0777'),('RW0703',3,1,'STAD0777'),('RW0704',4,1,'STAD0777'),('RW0705',5,1,'STAD0777'),('RW0706',6,1,'STAD0777'),('RW0707',7,1,'STAD0777'),('RW0708',8,2,'STAD0777'),('RW0709',9,2,'STAD0777'),('RW0710',10,2,'STAD0777'),('RW0711',11,2,'STAD0777'),('RW0712',12,2,'STAD0777'),('RW0713',13,2,'STAD0777'),('RW0714',14,2,'STAD0777'),('RW0715',15,2,'STAD0777'),('RW0716',16,2,'STAD0777'),('RW0717',17,2,'STAD0777'),('RW0718',18,2,'STAD0777'),('RW0719',19,2,'STAD0777'),('RW0720',20,2,'STAD0777'),('RW0721',21,3,'STAD0777'),('RW0722',22,3,'STAD0777'),('RW0723',23,3,'STAD0777'),('RW0724',24,3,'STAD0777'),('RW0725',25,3,'STAD0777'),('RW0726',26,3,'STAD0777'),('RW0727',27,3,'STAD0777'),('RW0728',28,3,'STAD0777'),('RW0729',29,3,'STAD0777'),('RW0730',30,3,'STAD0777'),('RW0801',1,1,'STAD0888'),('RW0802',2,1,'STAD0888'),('RW0803',3,1,'STAD0888'),('RW0804',4,1,'STAD0888'),('RW0805',5,1,'STAD0888'),('RW0806',6,1,'STAD0888'),('RW0807',7,1,'STAD0888'),('RW0808',8,2,'STAD0888'),('RW0809',9,2,'STAD0888'),('RW0810',10,2,'STAD0888'),('RW0811',11,2,'STAD0888'),('RW0812',12,2,'STAD0888'),('RW0813',13,2,'STAD0888'),('RW0814',14,2,'STAD0888'),('RW0815',15,2,'STAD0888'),('RW0816',16,2,'STAD0888'),('RW0817',17,2,'STAD0888'),('RW0818',18,2,'STAD0888'),('RW0819',19,2,'STAD0888'),('RW0820',20,2,'STAD0888'),('RW0821',21,3,'STAD0888'),('RW0822',22,3,'STAD0888'),('RW0823',23,3,'STAD0888'),('RW0824',24,3,'STAD0888'),('RW0825',25,3,'STAD0888'),('RW0826',26,3,'STAD0888'),('RW0827',27,3,'STAD0888'),('RW0828',28,3,'STAD0888'),('RW0829',29,3,'STAD0888'),('RW0830',30,3,'STAD0888'),('RW0901',1,1,'STAD0999'),('RW0902',2,1,'STAD0999'),('RW0903',3,1,'STAD0999'),('RW0904',4,1,'STAD0999'),('RW0905',5,1,'STAD0999'),('RW0906',6,1,'STAD0999'),('RW0907',7,1,'STAD0999'),('RW0908',8,2,'STAD0999'),('RW0909',9,2,'STAD0999'),('RW0910',10,2,'STAD0999'),('RW0911',11,2,'STAD0999'),('RW0912',12,2,'STAD0999'),('RW0913',13,2,'STAD0999'),('RW0914',14,2,'STAD0999'),('RW0915',15,2,'STAD0999'),('RW0916',16,2,'STAD0999'),('RW0917',17,2,'STAD0999'),('RW0918',18,2,'STAD0999'),('RW0919',19,2,'STAD0999'),('RW0920',20,2,'STAD0999'),('RW0921',21,3,'STAD0999'),('RW0922',22,3,'STAD0999'),('RW0923',23,3,'STAD0999'),('RW0924',24,3,'STAD0999'),('RW0925',25,3,'STAD0999'),('RW0926',26,3,'STAD0999'),('RW0927',27,3,'STAD0999'),('RW0928',28,3,'STAD0999'),('RW0929',29,3,'STAD0999'),('RW0930',30,3,'STAD0999'),('RW1001',1,1,'STAD1000'),('RW1002',2,1,'STAD1000'),('RW1003',3,1,'STAD1000'),('RW1004',4,1,'STAD1000'),('RW1005',5,1,'STAD1000'),('RW1006',6,1,'STAD1000'),('RW1007',7,1,'STAD1000'),('RW1008',8,2,'STAD1000'),('RW1009',9,2,'STAD1000'),('RW1010',10,2,'STAD1000'),('RW1011',11,2,'STAD1000'),('RW1012',12,2,'STAD1000'),('RW1013',13,2,'STAD1000'),('RW1014',14,2,'STAD1000'),('RW1015',15,2,'STAD1000'),('RW1016',16,2,'STAD1000'),('RW1017',17,2,'STAD1000'),('RW1018',18,2,'STAD1000'),('RW1019',19,2,'STAD1000'),('RW1020',20,2,'STAD1000'),('RW1021',21,3,'STAD1000'),('RW1022',22,3,'STAD1000'),('RW1023',23,3,'STAD1000'),('RW1024',24,3,'STAD1000'),('RW1025',25,3,'STAD1000'),('RW1026',26,3,'STAD1000'),('RW1027',27,3,'STAD1000'),('RW1028',28,3,'STAD1000'),('RW1029',29,3,'STAD1000'),('RW1030',30,3,'STAD1000');
/*!40000 ALTER TABLE `stadrow` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-05 21:28:27