// Expressions
require('./expr/Access');
require('./expr/Assign');
require('./expr/Bool');
require('./expr/Call');
require('./expr/Cast');
require('./expr/Float');
require('./expr/Identifier');
require('./expr/Index');
require('./expr/Integer');
require('./expr/Op');
require('./expr/Range');
require('./expr/Slice');
require('./expr/Splat');
require('./expr/String');
require('./expr/This');
require('./expr/Type');
require('./expr/TypeDesc');
require('./expr/Value');

// Statements
require('./stmt/Line');
require('./stmt/Body');
require('./stmt/Scope');
require('./stmt/Variable');

// Export the map of all tokens
module.exports = require('./Node').map;

