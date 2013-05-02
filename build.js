// Test -----------------------------------------------------------------------
// ----------------------------------------------------------------------------
var Compiler = require('./lib/compiler/Compiler');

var emblem = new Compiler();

// Test name resolving
emblem.getModule('modules.mod'); // File
//emblem.getModule('modules.im'); // File

