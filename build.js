// Test -----------------------------------------------------------------------
// ----------------------------------------------------------------------------
var Compiler = require('./lib/compiler/Compiler');

var emblem = new Compiler();

// Test name resolving
emblem.getModule('test.primitives');
emblem.getModule('test.statements');
emblem.getModule('test.functions');

