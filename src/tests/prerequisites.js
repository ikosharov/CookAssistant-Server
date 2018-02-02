// function to generate random usernames
var generateRandomString = function () {
    var randomNumStr = Math.random().toString();
    return randomNumStr.substr(randomNumStr.indexOf(".") + 1);
}

// users that will be reused between tests
var sharedUser = {
    username: "common" + generateRandomString(),
    password: "1234"
};

var otherUser = {
    username: "other" + generateRandomString(),
    password: "1234"
};

// recipes that will be reused between tests
var privateRecipeOfSharedUser = {
    title: "my private recipe",
    isPublic: false,
    rating: 5
};

var publicRecipeOfSharedUser = {
    title: "my public recipe",
    isPublic: true,
    rating: 2
};

var privateRecipeOfOtherUser = {
    title: "others private recipe",
    isPublic: false,
    rating: 5
};

var publicRecipeOfOtherUser = {
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