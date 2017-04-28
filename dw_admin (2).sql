-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 28, 2017 at 09:46 AM
-- Server version: 5.6.35
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


--/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
--/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
--/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
--/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dw_admin`
--

-- --------------------------------------------------------

--
-- Table structure for table `db_connectors`
--

CREATE TABLE `db_connectors` (
  `id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `connect_string` varchar(255) DEFAULT NULL,
  `character_set` varchar(255) DEFAULT NULL,
  `session_mode` decimal(9,2) DEFAULT NULL,
  `site_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `db_connectors`
--

INSERT INTO `db_connectors` (`id`, `name`, `type`, `username`, `password`, `connect_string`, `character_set`, `session_mode`, `site_id`) VALUES
(1, 'Sinai Central', 'Oracle', 'harry', 'squonk', 'FIN1_PROD80', '', '0.00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `group_members`
--

CREATE TABLE `group_members` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `assigned_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `group_members`
--

INSERT INTO `group_members` (`id`, `user_id`, `group_id`, `assigned_date`) VALUES
(2, 1, 3, '2017-04-25 21:11:46'),
(3, 1, 1, '2017-04-25 21:12:31'),
(4, 1, 2, '2017-04-25 21:12:35'),
(5, 2, 5, '2017-04-26 20:46:54'),
(6, 2, 3, '2017-04-26 21:05:02'),
(7, 3, 3, '2017-04-26 21:17:35');

-- --------------------------------------------------------

--
-- Table structure for table `local_auth`
--

CREATE TABLE `local_auth` (
  `id` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `change_password` varchar(1) NOT NULL DEFAULT 'Y',
  `last_reset` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `local_auth`
--

INSERT INTO `local_auth` (`id`, `username`, `password`, `change_password`, `last_reset`, `user_id`) VALUES
(1, 'andreh01', '499b3788250afa55dbeee3d69d8a208b', 'Y', '2017-04-03 20:04:00', 1),
(2, 'guptaa31', 'ed878dea41a3cfee39bf034f23dc2b39', 'Y', '2017-04-26 20:44:12', 2),
(3, 'mokun', 'c4251a786bd1bcbccc847b94314c0bb5', 'Y', '2017-04-26 20:49:13', 3);

-- --------------------------------------------------------

--
-- Table structure for table `privileges`
--

CREATE TABLE `privileges` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(10) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `site_id` int(11) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `site_id`, `description`) VALUES
(1, 'Talent Acquisition', 1, NULL),
(2, 'Labor Relations', 1, 'Really do they need projects?'),
(4, 'My P2', 2, ''),
(5, 'Justin', 1, 'A project for Justins'),
(6, 'My new project2', 1, NULL),
(7, 'micahel', 1, NULL),
(8, 'Debby', 3, ''),
(9, 'A new project', 1, '');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_start` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_last_touched` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `session_key` varchar(32) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Active',
  `session_end` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `session_start`, `session_last_touched`, `session_key`, `status`, `session_end`) VALUES
(1, 1, '2017-04-06 22:03:52', '2017-04-06 22:03:52', '3)7R\"^7&@R<ERR<+>NN7KR(\'^M^Y>M', 'Active', NULL),
(2, 1, '2017-04-06 22:08:41', '2017-04-06 22:08:41', '6EIsTSRhcxuOj9Ij8C5tWoHwEubcwo', 'Active', NULL),
(3, 1, '2017-04-06 22:08:51', '2017-04-06 22:08:51', 'BGt3wIPS8uqUUMCD4KdV69Al8cxOMA', 'Active', NULL),
(4, 1, '2017-04-07 20:38:24', '2017-04-07 20:38:24', 'VL0Iv21leP7PoGpoRvuL0Ot8BxVe2d', 'Active', NULL),
(5, 1, '2017-04-07 20:38:48', '2017-04-07 20:38:48', 'Wi9J82hBxDhLQQtI5TLpPtpkeQjqQH', 'Active', NULL),
(6, 1, '2017-04-07 20:48:54', '2017-04-07 20:48:54', 'isnjWjfXLFWmXns8iOgjVNjxDG5UAi', 'Active', NULL),
(7, 1, '2017-04-07 20:58:29', '2017-04-07 20:58:29', 'd3qKkC8iJUuA6i4GFDIbadWcMUMih6', 'Active', NULL),
(8, 1, '2017-04-07 20:59:50', '2017-04-07 20:59:50', 'CCPxrHcGLGAhu8GI99JPFjrXvK5XH3', 'Active', NULL),
(9, 1, '2017-04-07 21:01:36', '2017-04-07 21:01:36', 'rTB8Chs7bADFg2TNqkDWNHF6WRkI04', 'Active', NULL),
(10, 1, '2017-04-07 21:02:40', '2017-04-07 21:02:40', 'hbFgkrl2V7gph1m38u8XFpuPD6XGeo', 'Active', NULL),
(11, 1, '2017-04-10 20:26:40', '2017-04-10 20:26:40', 'uuxBXVKcq9JpmfJaJOrJ1W9X9gteDO', 'Active', NULL),
(12, 1, '2017-04-13 19:04:39', '2017-04-13 19:04:39', 'JlqeAH1Af5kssRR0rTBJUuXN5w0LFl', 'Active', NULL),
(13, 1, '2017-04-17 16:57:31', '2017-04-17 16:57:31', 'e6QDtsRgHenTPW9RnKm2jdKH6pvJF0', 'Active', NULL),
(14, 1, '2017-04-17 19:14:17', '2017-04-17 19:14:17', 'QGON6regw9L9T7SvocA2LJiHdA1aq5', 'Active', NULL),
(15, 1, '2017-04-18 20:32:53', '2017-04-18 20:32:53', '0bWdc7Gj4Fr2gbLp3tA77VlbIn4evb', 'Active', NULL),
(16, 1, '2017-04-24 19:04:30', '2017-04-24 19:04:30', 'SWOuVsfrjI62ClIGTEWnNh9Enu9nf2', 'Active', NULL),
(17, 1, '2017-04-26 20:43:14', '2017-04-26 20:43:14', '3qKJiTN22xe0TItIbfALwuVhfiwO10', 'Active', NULL),
(18, 3, '2017-04-26 20:49:30', '2017-04-26 20:49:30', 'Qu1pRT1V28dnjKj6cSAVD8Hd6xSOxL', 'Active', NULL),
(19, 1, '2017-04-26 21:03:42', '2017-04-26 21:03:42', 'kFRkJBlJhcRr6GfuKMPklHsTtbuHgo', 'Active', NULL),
(20, 1, '2017-04-26 21:12:33', '2017-04-26 21:12:33', 'kHsuMo1n9m9MFqPg20wWrPgpHjqLVi', 'Active', NULL),
(21, 1, '2017-04-27 20:40:49', '2017-04-27 20:40:49', 'sv1BLD3QWrdlSW8QTDPxQoXa5MCUoI', 'Active', NULL),
(22, 1, '2017-04-28 16:45:19', '2017-04-28 16:45:19', 'j14SgG2NrPxmWGwxmWhPMREbN9X4u0', 'Active', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE `sites` (
  `id` int(10) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sites`
--

INSERT INTO `sites` (`id`, `name`) VALUES
(1, 'Human Resources'),
(2, 'Finance Look'),
(3, 'My new site'),
(4, 'System'),
(5, 'My Site');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deactivated_date` timestamp NULL DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Active',
  `employee_id` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created_date`, `deactivated_date`, `name`, `status`, `employee_id`, `email`) VALUES
(1, '2017-03-31 20:08:28', NULL, 'Harry Andree', 'Active', '1407365', 'Harry.Andree@mountsinai.org'),
(2, '2017-04-26 20:43:39', NULL, 'Anisha Gupta', 'Active', '', ''),
(3, '2017-04-26 20:48:24', NULL, 'Michael Okun', 'Active', '', '');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `user_status` BEFORE UPDATE ON `users` FOR EACH ROW begin 
	if NEW.status = 'Inactive' then 
  		set NEW.deactivated_date = CURRENT_TIMESTAMP;
    else 
    	set NEW.deactivated_date = NULL;
	end if;
end
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `user_groups`
--

CREATE TABLE `user_groups` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_groups`
--

INSERT INTO `user_groups` (`id`, `site_id`, `name`, `description`) VALUES
(1, 4, 'Admin', NULL),
(2, 4, 'User admin', NULL),
(3, 1, 'Admin', NULL),
(4, 2, 'Admin', NULL),
(5, 1, 'ANisha', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `workbooks`
--

CREATE TABLE `workbooks` (
  `id` int(10) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `workbooks`
--

INSERT INTO `workbooks` (`id`, `project_id`, `name`) VALUES
(5, 2, 'khjgj'),
(6, 1, '34rtutru'),
(7, 4, 'Justin WEB'),
(8, 6, 'My new workbook'),
(9, 8, 'Hello');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `db_connectors`
--
ALTER TABLE `db_connectors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `local_auth`
--
ALTER TABLE `local_auth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `privileges`
--
ALTER TABLE `privileges`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_groups`
--
ALTER TABLE `user_groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workbooks`
--
ALTER TABLE `workbooks`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `db_connectors`
--
ALTER TABLE `db_connectors`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `group_members`
--
ALTER TABLE `group_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `local_auth`
--
ALTER TABLE `local_auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `privileges`
--
ALTER TABLE `privileges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT for table `sites`
--
ALTER TABLE `sites`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `user_groups`
--
ALTER TABLE `user_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `workbooks`
--
ALTER TABLE `workbooks`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
--/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
--/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
