const app = require('./server');

describe('server', () => {
  it('should register bodyParser.urlencoded middleware', () => {
    // eslint-disable-next-line
    app._router.stack[2].name.should.equal('urlencodedParser');
  });

  it('should register bodyParser.json middleware', () => {
    // eslint-disable-next-line
    app._router.stack[3].name.should.equal('jsonParser');
  });

  it('should register /api/v1 controller', () => {
    // eslint-disable-next-line
    app._router.stack[4].regexp.test('/api/v1').should.be.true();
  });
});
