// sexp.mjs
//
// MIT License 
// 
// Copyright (c) 2024 David J. Goehrig <dave@dloh.org> 
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy 
// of this software and associated documentation files (the "Software"), to deal 
// in the Software without restriction, including without limitation the rights 
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
// copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions: 
// 
// The above copyright notice and this permission notice shall be included in all 
// copies or substantial portions of the Software. 
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
// SOFTWARE. 
//

Object.prototype.list = function() {
	return Array.prototype.slice.apply(this,[0])
}

Function.prototype.send = function(...args) {
	return this.apply(this,...args)
}

Function.prototype.resend = function(message) {
	return this.apply(this,message)
}

export const hub = (function() {
	const self = function(method,...message) {
		const selector = message[0]
		const target = message[1]
		switch(method) {
		case 'subscribe':
			if (typeof(self._queues[selector]) != 'object') self._queues[selector] =  []
			if (typeof(self._queues[selector].indexOf(target) < 0)) self._queues[selector].push(target)
			break
		case 'unsubscribe':
			if (typeof(self._queues[selector]) != 'object') return;
			if (self._queues[selector].indexOf(target) <0) return;
			self._queues[selector].splice(self._queues[selector.indexOf(target)],1)
			break
		default:
			if (typeof(self._queues[method]) != 'object') return;
			self._queues[method].map( (o) => { 
				o.resend(message) 
			})
			break
		}
	}
	self._queues = {}
	return self
})()

Function.prototype.subscribe = function(method) {
	hub('subscribe',method,this)
}

Function.prototype.unsubscribe = function(method) {
	hub('unsubscribe',method,this)
}

Function.prototype.eval = function(json) {
	return this.resend(JSON.parse(json))
}

export const sexp = function (proto) {
	var self = function (op, ...args) {
		if (this.hasOwnProperty(op) && typeof(this[op]) == 'function') return this[op].resend(args)
		if (this.hasOwnProperty(op) && typeof(this[op]) == 'object') return self.apply(this[op], args)
		return {}
	}
	return self.bind(proto)
}

export const handler = function(E) {
	var S = sexp(E)
	return (...M) => { return S.apply(null,M) }
}


