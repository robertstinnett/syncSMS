//syncSMS by dmxrob - http://blog.dmxrob.net | ssh://bbs.dmxrob.net | telnet://bbs.dmxrob
//Github:  https://github.com/robertstinnett/syncSMS
//Code for Error Handling by Kirkman - http://breakintochat.com & https://github.com/Kirkman

// Setup some color variables
var gy = "\1n\001w"; //Synchronet Ctrl-A Code for Normal White (which looks gray)
var wh = "\001w\1h"; //Synchronet Ctrl-A Code for High Intensity White
var drkyl = "\001n\001y"; //Synchronet Ctrl-A Code for Dark (normal) Yellow
var yl = "\001y\1h"; //Synchronet Ctrl-A Code for High Intensity Yellow
var drkbl = "\001n\001b"; //Synchronet Ctrl-A Code for Dark (normal) Blue
var bl = "\001b\1h"; //Synchronet Ctrl-A Code for High Intensity Blue
var drkrd = "\001n\001r"; //Synchronet Ctrl-A Code for Dark (normal) Red
var rd = "\001r\1h"; //Synchronet Ctrl-A Code for High Intensity Red
var drkcy = "\001n\001c"; //Synchronet Ctrl-A Code for Dark (normal) Cyan
var cy = "\001c\1h"; //Synchronet Ctrl-A Code for High Intensity Cyan
var gr = "\001g\1h"; //Synchronet Ctrl-A Code for High Intensity Green



var version = cy + "1.00" + bl + " - " + cy + "XX/XX/2019";

var apiEndpoint = "https://api.twilio.com/2010-04-01/Accounts/";
var apiMessages = "latest.json?app_id=";
var apiCurrencyListCall = "currencies.json?prettyprint=true&show_alternative=false&show_inactive=false";  // Freebie call!

var updateURL = "http://api.dmxrob.net/doorcheck/"
var updateFlag = true;

var usd_amount = 1;  // Base currency amount in USD

log(user.ip_address);

//Load modopts.ini info early so we can detect if the section exists for [syncSMS]
//see sysop.txt for what should be in this section
var opts=load({},"modopts.js","syncSMS"); 
if (opts === null) {
	log("ERROR in sms.js: opts is null.");
	log("ERROR in sms.js: Are you sure you have a section in modopts.ini labeled [syncSMS]? See sysop.txt for instructions.");
	exit();
}

load("http.js"); //this loads the http libraries which you will need to make requests to the web server
load("sbbsdefs.js"); //loads a bunch-o-stuff that is probably beyond the understanding of mere mortals 

// Get configuration information
// See the sysop.txt file for more information
var smsNumber = opts.smsNumber;
var twilioAccountSid = opts.twilioAccountSid;
var twilioAuthToken = opts.twilioAuthToken;
var updateFlag = opts.updateFlag;






function displayHeader() {
	// Display program splash screen
	console.clear();
	console.putmsg(gr + "  ________"); 
	console.crlf();
	console.putmsg(gr + " (_]----[_)");
	var whereTitleGoes = console.getxy();
	console.crlf();
	console.putmsg(gr + ".~ |.''.|");
	var whereSloganGoes = console.getxy();
	console.crlf();
	console.putmsg(gr + "~. |'..'|");
	console.crlf();
	console.putmsg(gr + " `~`----`"); 
	console.crlf();
	var whereBottomIs = console.getxy();
    console.gotoxy(whereTitleGoes);
	console.putmsg(bl + "  syncSMS " + cy + "v" + version + bl + " by " + wh + "dmxrob");
	console.gotoxy(whereSloganGoes);
	console.putmsg(yl + "  Send direct text messages to the SysOp");
	console.gotoxy(whereBottomIs);
	console.crlf(2);
	
}

function sendSMSMessage() {
	// Get the message to send and then send it!
	var mySMSMessage = "";

	console.putmsg(bl + "Enter your message below. Limit of 160 characters. Keep it short and sweet.");
	console.crlf();
	console.putmsg(yl + ":");
	mySMSMessage = console.getstr(maxlen=160);

	if (console.yesno("Send above text msg to " + system.operator + "")) {
		// Ok, let's send it.

		var req = new HTTPRequest();
		var reqData = "To=+15734899806"; 
		var sendSMSResult = req.post(apiEndpoint + twilioAccountSid  + "/Messages.json",reqData);
		if (sendSMSResult === undefined) {
			// Something went wrong
			log("ERROR in sms.js:  Request to openexchangerates.org returned nothing/undefined");
			console.putmsg("We're sorry, Currency Exchange Rates are not available right now. :-(")
			exit();
		}
		console.putmsg(sendSMSResult);

		// Parse the JSON
		var currentRatesJSON = JSON.parse(currentRatesResponse);

	}
}

function checkForUpdates(updateFlag) {
	// This function checks, if enabled, the current version and alerts if a new version is available.
	// See sysop.txt for information on enabling/disabling


	if (updateFlag) {

	}
}


function getExchangeRates() {
// This function calls the API and displays the current exchange rates. 

		
		// Make the API call
		var req = new HTTPRequest();
		var currentRatesResponse = req.Post(apiEndpoint +  + openExchangeAPIkey);
		if (currentRatesResponse === undefined) {
			// Something went wrong
			log("ERROR in sms.js:  Request to openexchangerates.org returned nothing/undefined");
			console.putmsg("We're sorry, Currency Exchange Rates are not available right now. :-(")
			exit();
		}

		// Parse the JSON
		var currentRatesJSON = JSON.parse(currentRatesResponse);



		// Print it out
		var exchangeRates = Object.keys(currentRatesJSON.rates);
		var dt = new Date(currentRatesJSON.timestamp*1000);
		console.crlf();
		console.putmsg(bl + "Exchange Rates Current as of " + yl + dt);
		console.crlf();
		console.putmsg(bl + "Rates shown below are for " + wh + usd_amount + " USD.")
		console.crlf();
		console.crlf();
	
		
		for (var i = 0; i < exchangeRates.length; i++) {
			if (currencyTypeList.indexOf(exchangeRates[i]) > -1) {
				console.putmsg(currentRatesJSON.rates[exchangeRates[i]] + " - " + exchangeRates[i]);
				console.crlf();
			}
		}

		
	
	
		console.crlf();

		// Return JSON object with rates so we don't have to continue making repeat calls to API 

		return currentRatesJSON; 
		
		



}


function searchExchangeRates(currentRatesJSON) {
	// This function will allow the user to search Exchange Rates for a currency.

	var exchangeRates = Object.keys(currentRatesJSON.rates);
	var ready_to_exit = false;
	var user_input = "";
	
	var dt = new Date(currentRatesJSON.timestamp*1000);

	while (!ready_to_exit && bbs.online) {
		console.putmsg(bl + "Enter currency to search for, " + wh + "?" + bl + " for list or " + wh + "Q" + bl + " to quit: ")
		user_input = console.getstr(user_input,3);  // Read a maximum of 3 letters in.
		
		if (user_input == "Q" || user_input == "q") {
			ready_to_exit = true;
		}
		else if (user_input == "?") { // Display all the currencies to choose from
			console.putmsg(rd + "Valid currencies to choose from:");
			console.crlf();
			for (var i = 0; i < exchangeRates.length; i++) { // Print out currencies, 15 per line.
					if (i%15 == 0) {
						console.crlf();
					}
					console.putmsg(wh + exchangeRates[i] + gy + ",");
					
				
			}
			console.crlf();


		}
		else if (exchangeRates.indexOf(user_input) != -1) { //Found it, display it
			console.crlf();
			console.putmsg(wh + usd_amount + cy + " USD" + bl + " is equal to " + wh + currentRatesJSON.rates[user_input] + cy + " " + user_input + bl + " as of " + yl + dt);
			console.crlf(2);
		}
		else {
			console.putmsg(rd + "Invalid choice " + wh + user_input + rd + ". Try again.");
			console.crlf();
		}

		

	}

}
       
			

try {

	// Print a welcome message and header

	displayHeader();
	sendSMSMessage();
	console.pause();
    console.clear();
    console.aborted = false;

} catch (err) {

log("ERROR in sms.js. " + err);
log(LOG_DEBUG,"DEBUG for sms.js. API call looked like this at time of error: " + apiEndpoint + openExchangeAPIkey);
log(LOG_DEBUG,"DEBUG for sms.js. The user.connection object looked like this at the time of error: " + user.connection);


} finally {

    exit();

}

exit();
