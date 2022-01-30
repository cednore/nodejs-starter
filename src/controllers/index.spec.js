const { router } = require('./index');

describe('controllers', () => {
  it('should register UserController and default ErrorHandler', () => {
    router.stack.length.should.equal(2);
    router.stack[0].name.should.equal('router'); // UserController
    router.stack[1].name.should.equal('Handler'); // ErrorHandler
  });

  it('should register /users controller', () => {
    router.stack[0].regexp.test('/users').should.be.true();
  });
});
