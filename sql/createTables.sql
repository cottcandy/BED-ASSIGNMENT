CREATE TABLE Members (
  member_id INT IDENTITY(1,1) PRIMARY KEY,
  member_email VARCHAR(255) NOT NULL UNIQUE, 
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  birthday DATE,
  phone_number VARCHAR(20)
);


CREATE TABLE Administrators (
  administrator_id INT IDENTITY(1,1) PRIMARY KEY,
  administrator_email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL 
);


CREATE TABLE Posts (
  post_id INT IDENTITY(1,1) PRIMARY KEY,
  administrator_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  picture_url VARCHAR(255),
  event_type VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (administrator_id) REFERENCES administrators(administrator_id)
);


CREATE TABLE Donations ( 
    donation_id INT IDENTITY(1,1) PRIMARY KEY, 
    member_id INT, 
    event_type VARCHAR (100), 
    donation_amount DECIMAL(10, 2), 
    donation_date DATE, 
    FOREIGN KEY (member_id) REFERENCES Members(member_id) 
); 


CREATE TABLE PaymentDetails ( 
    payment_id INT IDENTITY(1,1) PRIMARY KEY, 
    donation_id INT, 
    payment_method VARCHAR(50), 
    payment_date DATE, 
    payment_status VARCHAR(50), 
    FOREIGN KEY (donation_id) REFERENCES Donations(donation_id) 
);


CREATE TABLE Volunteers (
  voluteer_id INT IDENTITY(1,1) PRIMARY KEY,
  post_id INT NOT NULL,
  member_id INT NOT NULL,
  member_email VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  available_date DATE NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  FOREIGN KEY (member_id) REFERENCES members(member_id)
);
