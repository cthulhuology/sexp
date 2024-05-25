sexp - Answering the Question sexp?
-----------------------------------

This is a javascript utility that makes messaging fun again.

The basic concept is you use s-expressions and have them 
interpreted by a javascript object of the appropriate form.

	async const handler = sexp({
		"foo" : {
			"bar": function(x) {
				return x*2
			}		
		},
		"help": function() {
			console.log("call me via handler([ 'foo', 'bar', 123 ])")
		}
	})

It also has helpers to make lambda function handlers less lame,
and makes it possible to share code across multiple approaches
REST, Websockets, in browser, etc.

In addition to modeling a set of state transision as s-expressions, you also have
a message hub that models pub/sub messages between functions.

	const fun = function(msg) {
		console.log(msg)
	}
	fun.subscribe('topic')

This allows a function to subscribe to an identifier and be called each time a message
is published to that identifier. For example:

	hub('topic','hello world')

Will result in the string 'hello world' being logged to the console.  Multiple functions
can all subscribe to the same identifier, and they can each implement their own logic
and bindigns.  Similarly, a function can unsubscribe from a identifier:

	fun.unsubscribe('topic') 

And as such it will never be invoked again until the subscription is reestablished.

For those interpreting JSON arrays as s-expressions another expansion is done via the 
'eval' method:

	const fsm = handler({ "foo": {  "bar" : (x) => { return x*2 }}})
	console.log(fsm.eval('[ "foo","bar", 21 ]'))
	
will parse the s-expression JSON and resend it to the function in this case resuting in

	42


