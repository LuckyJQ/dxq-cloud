if (process.env.NODE_ENV === 'production') {
  module.exports = require('./tencent-ai.common.prod.js');
} else {
  module.exports = require('./tencent-ai.common.dev.js');
}
