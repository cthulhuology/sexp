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
