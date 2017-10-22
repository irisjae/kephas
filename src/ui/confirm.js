var _interaction_ = function (components, unions) {
	var messages = components .messages;
	var send = components .send;

	var confirm = components .confirm;
	
	var stepper = components .stepper;
	
	var extension = interaction (transition (function (intent, license) {
	    if (intent [0] === 'confirm')
	        return function (tenure) {
	            stepper .intent ([stepper .state (), 'payment'])
	            tenure ('confirmed');
	            tenure .end (true);
	        }
	   else
	        return decline_ (intent);
	}))
	
	stepper .intent ([stepper .state (), 'uploads']);
	confirm .thru (tap, function () {
	    extension .intent (['confirm'])
	});
};




var dom = document;


//SCHEMA: date, person, message
var api_conversation = stream ();

var dropdowns = activated ('dropdown');
var inputs = activated ('input');
var textareas = activated ('textarea');

var actions = type_of ('action');


var stepper_cases = {
	uploads: document .querySelector ('[uploads]'),
    payment: document .querySelector ('[payment]')
};


var _interaction = _interaction_ ({
	messages: interaction_input (textareas .message [0]),
	send: stream_from_click_on (actions .send [0]),
	confirm: stream_from_click_on (actions .confirm [0]),
	stepper: interaction_case (stepper_cases)
})