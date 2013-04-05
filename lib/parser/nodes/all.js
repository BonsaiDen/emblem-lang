// Expressions
require('./expr/Access');
require('./expr/Assign');
require('./expr/Bool');
require('./expr/Call');
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
require('./expr/Value');

// Export the map of all tokens
module.exports = require('./Node').map;

