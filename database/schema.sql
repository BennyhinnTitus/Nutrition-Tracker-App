CREATE TABLE userdata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  height INT CHECK (height > 0),
  weight INT CHECK (weight > 0),
  age INT CHECK (age > 0)
);

CREATE TABLE targetdata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userdata_id INT NOT NULL,
  water INT CHECK (water > 0),
  weight INT CHECK (weight > 0),
  cal_intake INT CHECK (cal_intake > 0),
  cal_burn INT CHECK (cal_burn > 0),
  FOREIGN KEY (userdata_id) REFERENCES userdata(id)
);

CREATE TABLE dailydata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userdata_id INT NOT NULL,
  water INT CHECK (water >= 0),
  cal_intake INT CHECK (cal_intake >= 0),
  cal_burn INT CHECK (cal_burn >= 0),
  weight INT CHECK (weight > 0),
  log_date DATE NOT NULL,
  FOREIGN KEY (userdata_id) REFERENCES userdata(id),
  UNIQUE (userdata_id, log_date)
);

CREATE TABLE historydata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userdata_id INT,
  water INT,
  cal_intake INT,
  cal_burn INT,
  log_date DATE,
  FOREIGN KEY (userdata_id) REFERENCES userdata(id)
);
