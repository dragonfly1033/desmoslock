// ==UserScript==
// @name         Desmos-Lock
// @namespace    dragonfly1033.Desmos
// @version      0.1
// @description  an equation with variables can be moved/made and saved easily by locking variables
// @author       dragonfly1033
// @match        https://*.desmos.com/calculator*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://github.com/dragonfly1033/desmoslock/raw/master/desmos-lock.user.js
// @updateURL   https://github.com/dragonfly1033/desmoslock/raw/master/desmos-lock.user.js
// ==/UserScript==

(function() {
    'use strict';

function start(){

	if (window.location.href.includes("desmos.com/calculator")) {
		if (typeof Calc != "undefined") { //thanks u/SlimRunner
			var DLock = {};
			DLock.getLock = function() { //gets the array of all lockable variables
				var expressions = Calc.getState().expressions.list;
				for (var i = 0; i < expressions.length; i++) {
					if (expressions[i].latex) if (expressions[i].latex.startsWith("l_{ock}")) return expressions[i].id;
				}
			}
			DLock.lastSelectedExpression = false;
			DLock.set = function() {
				if (Calc.isAnyExpressionSelected) DLock.lastSelectedExpression = Calc.selectedExpressionId;
				var selected = DLock.lastSelectedExpression;
				if (selected === false) {
					window.alert("Please select an expression");
					return
				}
				var id = DLock.getLock();
				var lock = Calc.expressionAnalysis[id];
				var values = lock.evaluation.value;
				var vars = DLock.getExpression(id).latex.split("[")[1].split("\\right]")[0].split(",");
				var expr = DLock.getExpression(selected);
				var currentLatex = expr.latex;
				for (var i = 0; i < vars.length; i++) {
					currentLatex = currentLatex.split(vars[i]).join("\\left(" + values[i] + "\\right)");
				}
				expr.latex = currentLatex;
				expr.id = "dlock" + (new Date()).getTime();
				Calc.setExpression(expr);
			}
			DLock.getExpression = function(id) {
				var expressions = Calc.getState().expressions.list;
				for (var i = 0; i < expressions.length; i++) {
					if (expressions[i].id === id) return expressions[i];
				}
			}
			DLock.handler = function(e) {
				if (e.altKey && ((e.code == "KeyL") || (e.key == "l"))) {
					DLock.set();
				}
			}
			document.addEventListener('keyup', DLock.handler);
            console.log("Desmos-Lock Loaded ✔️")
		} else {
			window.alert("uh oh, something went wrong")
			}
	} else {
		window.alert("this only works on desmos.com/calculator :v")
		}
}
function tryStart(){
	  if (window.Calc !== undefined) {
	    	start();
	  } else {
	    	setTimeout(tryStart, 50)
	  }
}
tryStart();
})();
