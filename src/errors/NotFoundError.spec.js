const NotFoundError = require('./NotFoundError');

describe('errors/NotFoundError', () => {
  it('should exist', () => {
    NotFoundError.should.be.Function();
    NotFoundError.length.should.equal(2);
  });

  it('should set correct name and status', () => {
    const err = new NotFoundError();

    err.name.should.equal('ERROR_NOT_FOUND');
    err.status.should.equal(404);
  });

  it('should set correct error message', () => {
    new NotFoundError().message.should.equal('Requested resource not found!');
    new NotFoundError('user').message.should.equal('Requested user not found!');
    new NotFoundError(null, 3).message.should.equal('Requested resource #3 not found!');
    new NotFoundError('post', 10).message.should.equal('Requested post #10 not found!');
  });
});
