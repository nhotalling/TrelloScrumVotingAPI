var VOTING_LIST_NAME = "Voting"; // The name of your Voting list
var MONITORING_DURATION = 5000; // how often to check for updated votes in milliseconds
var tep = new TrelloExportPopup();
var _listID = "";
var _monitoring_interval;

// https://github.com/Swader/TrelloUI
// adds TrelloUI event listeners
var tui = new TrelloUI({
	dispatchBoardReady: true,
	dispatchListsReady: true
});

// is this necessary?
chrome.extension.sendMessage({}, function (response) {});
 
document.addEventListener('trelloui-boardready', function() {
    console.log("Board is ready!");
});

document.addEventListener('trelloui-listsready', function() {
    console.log("Lists are ready!");
	
	// setup popup window
	tep.init();
	
	// bind handler to 'Voting' list's menu button
	$votingMenuButton = $(".js-list-header h2:contains('" + VOTING_LIST_NAME + "')").closest('.js-list-header').find(".list-header-menu-icon");
    if($votingMenuButton.length > 0) 
	{
		$votingMenuButton.click(function(event) {
			// get all cards from list
			chrome.extension.sendMessage({
				command: 'getListCards',
				id: _listID
			}, function (data) {
				console.log(data);
				tep.buildTemplate(data);
				tep.show();
				monitorVotes();
			});
			
			return false; // prevent standard menu from opening
		});
	}
	// prep listID
	getListID();
});

function monitorVotes() {
	clearInterval(_monitoring_interval);
	_monitoring_interval = setInterval(checkForVoteUpdates, MONITORING_DURATION);
}

// get voting list's ID and store it as data on the popup
// could also just store it as a global variable...(_listID) but not sure it will persist
function getListID() {
	// popup is created during trelloui-listsready, so we should have access to it
	var popoverScan = $('.trello_helper_export_popup');
    if ($(popoverScan).length > 0) {
		var tempListID = $(popoverScan).data('listID');
		if(tempListID !== undefined) {
			_listID = tempListID;
			console.log('listID retrieved from html: ' + _listID);
		} else {
			console.log('listID not found in html');
			
			// get list ID from API by using first card's ID
			var cardList = $(".js-list-header h2:contains('" + VOTING_LIST_NAME +"')").closest('.list').find('.list-card');
			if($(cardList).length > 0) {
				console.log($(cardList));
				var firstCardID = $(cardList[0]).find('a.list-card-title').attr('href').split('/')[2];
				console.log('firstCardID: ' + firstCardID);
				
				// call function in extension (background.js)
				chrome.extension.sendMessage({
					command: 'getCardListId',
					id: firstCardID
				}, function (data) {
					if (data.idList !== undefined) {
						console.log(data);
						_listID = data.idList;
						// add listID to popup data attribute
						$(popoverScan).data('listID', _listID);
						console.log('listID saved to html:' + _listID);
					}
				});
				
			} else {
				console.log('card list not found');
			}
		}
	} else {
		console.log('popup not found');
    }
}

// query API to retrieve card descriptions
function getVotes() {
	// lookup list ID
	getListID();
	
	// get all cards from list
	chrome.extension.sendMessage({
		command: 'getListCards',
		id: _listID
	}, function (data) {
		console.log(data);
		tep.showData(data);
	});
}

function checkForVoteUpdates() {
	// lookup list ID
	getListID();
	
	// get all cards from list
	chrome.extension.sendMessage({
		command: 'getListCards',
		id: _listID
	}, function (data) {
		console.log(data);
		tep.updateStatus(data);
	});
}