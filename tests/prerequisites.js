// function to generate random usernames
var generateRandomString = function () {
    var randomNumStr = Math.random().toString();
    return randomNumStr.substr(randomNumStr.indexOf(".") + 1);
}

// users that will be reused between tests
var sharedUser = {
    username: "common" + generateRandomString(),
    password: "commonPassword"
};

var otherUser = {
    username: "other" + generateRandomString(),
    password: "password"
};

// recipes that will be reused between tests
var privateRecipeOfSharedUser = {
    title: "potatoes",
    isPublic: "false"
};

var publicRecipeOfSharedUser = {
    title: "potatoes",
    isPublic: "true"
};

var privateRecipeOfOtherUser = {
    title: "potatoes",
    isPublic: "false"
};

var publicRecipeOfOtherUser = {
    title: "potatoes",
    isPublic: "true"
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