CREATE TABLE userdata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(50) NOT NULL,
  user_email VARCHAR(50) NOT NULL UNIQUE,
  height INT CHECK (height > 0),
  weight INT CHECK (weight > 0),
  age INT CHECK (age > 0)
  target_water_intake INT CHECK (water > 0),
  target_body_weight INT CHECK (weight > 0),
  target_cal_intake INT CHECK (cal_intake > 0),
  target_cal_burn INT CHECK (cal_burn > 0),
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
