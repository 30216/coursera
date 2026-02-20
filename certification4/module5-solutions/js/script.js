(function (global) {

var dc = {};

var homeHtml = "snippets/home-snippet.html";
var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";

var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

document.addEventListener("DOMContentLoaded", function (event) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowHomeHTML, true);
});

function buildAndShowHomeHTML(categories) {
  $ajaxUtils.sendGetRequest(homeHtml, function (homeHtmlResponse) {
    var chosenCategory = chooseRandomCategory(categories);
    var randomCategoryShortName = chosenCategory.short_name;
    var homeHtmlToInsertIntoMainPage = insertProperty(
      homeHtmlResponse,
      "randomCategoryShortName",
      "'" + randomCategoryShortName + "'"
    );
    insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
  }, false);
}

function chooseRandomCategory(categories) {
  var randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
}

dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort, buildAndShowMenuItemsHTML);
};

function buildAndShowMenuItemsHTML(menuItems) {
  $ajaxUtils.sendGetRequest("snippets/menu-items-title.html", function (menuItemsTitleHtml) {
    $ajaxUtils.sendGetRequest("snippets/menu-item.html", function (menuItemHtml) {
      var menuItemsViewHtml = buildMenuItemsViewHtml(menuItems, menuItemsTitleHtml, menuItemHtml);
      insertHtml("#main-content", menuItemsViewHtml);
    }, false);
  }, false);
}

function buildMenuItemsViewHtml(menuItems, menuItemsTitleHtml, menuItemHtml) {
  menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", menuItems.category.name);
  menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", menuItems.category.special_instructions);
  var finalHtml = menuItemsTitleHtml + "<section class='row'>";
  var menuItemsArray = menuItems.menu_items;
  var catShortName = menuItems.category.short_name;
  for (var i = 0; i < menuItemsArray.length; i++) {
    var html = menuItemHtml;
    html = insertProperty(html, "short_name", menuItemsArray[i].short_name);
    html = insertProperty(html, "catShortName", catShortName);
    html = insertProperty(html, "name", menuItemsArray[i].name);
    html = insertProperty(html, "description", menuItemsArray[i].description);
    finalHtml += html;
  }
  finalHtml += "</section>";
  return finalHtml;
}

global.$dc = dc;

})(window);
