var exportPopup;
var _htmlTemplate = "";

var TrelloExportPopup = function() {

}

TrelloExportPopup.prototype.init = function() {
    // When run, this makes sure the popup isn't around.
    // If it finds the popup residue, it removes it, paving the way for a fresh one.
    var popoverScan = $('.trello_helper_export_popup');
    if ($(popoverScan).length > 0) {
        $(popoverScan).remove();
    }
    popoverScan = null;

    // Create our new popup, hidden by default
    exportPopup = $('<div class="trello_helper_export_popup" style="display: none"></div>');

    // Create a header area for the popup, which will contain the buttons / tabs
    // Create a body area, which will contain the export data
    var header = $('<div class="trello_helper_export_popup_header"></div>');
    var body = $('<div class="trello_helper_export_popup_body"></div>');

    // Create header buttons / tabs
    var btnClear = $('<a href="#" class="exporttab button" data-area="clear">Clear</a>');
    var btnShowVotes = $('<a href="#" class="exporttab button" data-area="showvotes">Show Votes</a>');
    var closeButton = $('<a href="#" class="button right">Close</a>');

    // Have the close button close our tab, and do the same if the user clicks outside the popup
    $(closeButton).click(this.hide);
	$(btnShowVotes).click(getVotes); // call getVotes function in main.js
	$(btnClear).click(this.clearVotes);

    // Put everything together
    $(header).append(btnShowVotes).append(btnClear).append(closeButton);
    $(exportPopup).append(header).append(body);

    // Add out popup to the Trello page
    $("#content").append(exportPopup);
};

TrelloExportPopup.prototype.hide = function() {
	clearInterval(_monitoring_interval);
    // Execute hiding logic only if the popup is visible
    if ($(".trello_helper_export_popup").is(":visible")) {
        $(exportPopup).hide();
    }
};

TrelloExportPopup.prototype.show = function() {
	$(exportPopup).show();
};

TrelloExportPopup.prototype.buildTemplate = function(data) {
	var cardCount = data.length;
	if(_htmlTemplate === '') {
		_htmlTemplate += '<div id="votingWrapper">';
		var i = 0;
		while (i < cardCount) {
			_htmlTemplate += '<div class="votingUserWrapper" style="border:1px dashed #ccc">';
			_htmlTemplate += '<div class="votingUserAvatar">';
			if (data[i].members.length > 0) {
				_htmlTemplate += '<span class="imgHelper"></span><img src="https://trello-avatars.s3.amazonaws.com/' + data[i].members[0].avatarHash + '/30.png" width="30" />';
			} else {
				_htmlTemplate += data[i].name;
			}
			_htmlTemplate += '</div>'; // end votingUserAvatar
			_htmlTemplate += '<div class="votingUserVote ' + data[i].shortLink + ' voteCleared" data-lastactivity="' + data[i].dateLastActivity + '">';
			_htmlTemplate += '?';
			_htmlTemplate += '</div>'; // end votingUserVote
			_htmlTemplate += '</div>'; // end votingUserWrapper

			i++;
		}
		_htmlTemplate += '</div>';
	} // end _htmlTemplate
	
	$(".trello_helper_export_popup_body").html(_htmlTemplate);
};

TrelloExportPopup.prototype.showData = function(data) {
	// stop monitoring
	clearInterval(_monitoring_interval);
	
	// currently expects number of cards to be the same as when the template was built
	var cardCount = data.length;
	var i = 0;
	while (i < cardCount) {
		// find user's card
		var thisCard = $(".votingUserVote." + data[i].shortLink);
		if($(thisCard).length > 0 && data[i].desc) {
			// clear gray background and change contents to the vote value
			$(thisCard).removeClass("voteCleared").html(data[i].desc);
			// update last updated date
			$(thisCard).data('lastactivity', data[i].dateLastActivity);
		}
		i++;
	}
};

// called by monitoring_interval - if the last updated date has changed,
// a user has updated their vote
TrelloExportPopup.prototype.updateStatus = function(data) {
	var cardCount = data.length;
	var i = 0;
	while (i < cardCount) {
		// find user's card
		var thisCard = $(".votingUserVote." + data[i].shortLink);
		if($(thisCard).length > 0 && data[i].dateLastActivity) {
			if($(thisCard).data('lastactivity') !== data[i].dateLastActivity) {
				// clear gray background and change contents to a checkmark
				$(thisCard).removeClass("voteCleared").html("&#10004;");
				// update last updated date
				$(thisCard).data('lastactivity', data[i].dateLastActivity);
			}
		}
		i++;
	}
};

TrelloExportPopup.prototype.clearVotes = function() {
	// select .votingUserVote divs, add .voteCleared class, and set html content to "?"
	$(".votingUserVote").addClass("voteCleared").html("?");
	
	// start monitoring function in main.js
	monitorVotes();
};