const userDb = {
  users: require("../model/user.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  const duplicate = userDb.users.find((person) => person.username === user);
  if (duplicate) return res.status(409).json({ message: "User already exist" });
  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = { username: user, password: hashedPwd };
    userDb.setUsers([...userDb.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "user.json"),
      JSON.stringify(userDb.users)
    );
    res.status(201).json({ success: `New user ${user} created` });
  } catch (err) {
    res.sendStatus(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
