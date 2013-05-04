// Test -----------------------------------------------------------------------
// ----------------------------------------------------------------------------
var Compiler = require('./lib/compiler/Compiler');

var emblem = new Compiler();

// Test name resolving
emblem.getModule('test.primitives'); // File
emblem.getModule('test.statements'); // File
//emblem.getModule('modules.im'); // File

