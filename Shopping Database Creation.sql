CREATE DATABASE  IF NOT EXISTS `shoppingdb`;

use shoppingdb;


DROP TABLE IF EXISTS `store`;

CREATE TABLE `store` (
  `id` decimal(65,0) NOT NULL,
  `name` varchar(45) NOT NULL,
  `handle` varchar(45) NOT NULL,
  `alias` varchar(45) NOT NULL,
  `description` text,
  `image_url` varchar(256) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` decimal(65,0) NOT NULL,
  `title` varchar(45) NOT NULL,
  `vendor` varchar(45) DEFAULT NULL,
  `description` text,
  `handle` varchar(45) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `options` json DEFAULT NULL,
  `variants` json DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `parentCategoryId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `category_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `prd_ctg_assc`;

CREATE TABLE `prd_ctg_assc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` decimal(65,0) DEFAULT NULL,
  `prod_id` decimal(65,0) DEFAULT NULL,
  `ctg_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  KEY `prod_id` (`prod_id`),
  KEY `ctg_id` (`ctg_id`),
  CONSTRAINT `prd_ctg_assc_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`),
  CONSTRAINT `prd_ctg_assc_ibfk_2` FOREIGN KEY (`prod_id`) REFERENCES `product` (`id`),
  CONSTRAINT `prd_ctg_assc_ibfk_3` FOREIGN KEY (`ctg_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=709 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `cartitem`;

CREATE TABLE `cartitem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` varchar(65) NOT NULL,
  `user_id` varchar(65) NOT NULL,
  `store_id` decimal(65,0) NOT NULL,
  `prod_id` decimal(65,0) NOT NULL,
  `variant_id` varchar(45) NOT NULL,
  `unit_price` decimal(5,2) NOT NULL DEFAULT '0.00',
  `quantity` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  KEY `prod_id` (`prod_id`),
  CONSTRAINT `cartitem_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`),
  CONSTRAINT `cartitem_ibfk_2` FOREIGN KEY (`prod_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=99008 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) NOT NULL,
  `customer_id` decimal(65,0) NOT NULL,
  `order_id` decimal(65,0) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
