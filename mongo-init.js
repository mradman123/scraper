db.createUser(
  {
      user: "misthoUser",
      pwd: "misthoPass",
      roles: [
          {
              role: "readWrite",
              db: "misthoDatabase"
          }
      ]
  }
);