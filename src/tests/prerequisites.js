// function to generate random usernames
let generateRandomString = function () {
  let randomNumStr = Math.random().toString();
  return randomNumStr.substr(randomNumStr.indexOf(".") + 1);
}

// users that will be reused between tests
let sharedUser = {
  username: "common" + generateRandomString(),
  password: "1234"
};

let otherUser = {
  username: "other" + generateRandomString(),
  password: "1234"
};

// recipes that will be reused between tests
let privateRecipeOfSharedUser = {
  title: "my private recipe",
  isPublic: false,
  rating: 5
};

let publicRecipeOfSharedUser = {
  title: "my public recipe",
  isPublic: true,
  rating: 2
};

let privateRecipeOfOtherUser = {
  title: "others private recipe",
  isPublic: false,
  rating: 5
};

let publicRecipeOfOtherUser = {
  title: "others public recipe",
  isPublic: true,
  ratign: 2
};

module.exports = {
  generateRandomString: generateRandomString,
  sharedUser: sharedUser,
  otherUser: otherUser,
  privateRecipeOfSharedUser: privateRecipeOfSharedUser,
  publicRecipeOfSharedUser: publicRecipeOfSharedUser,
  privateRecipeOfOtherUser: privateRecipeOfOtherUser,
  publicRecipeOfOtherUser: publicRecipeOfOtherUser
}