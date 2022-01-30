/* eslint-disable no-unused-expressions */

const { expect } = require('chai');

const ValidationError = require('./ValidationError');

describe('errors/ValidationError', () => {
  it('should exist', () => {
    ValidationError.should.be.Function();
    ValidationError.length.should.equal(1);
  });

  it('should set correct name, status, and message', () => {
    const err = new ValidationError();

    err.name.should.equal('ERROR_VALIDATION');
    err.status.should.equal(422);
    err.message.should.equal('Validation failed!');
  });

  it('should extract errors from validation object', () => {
    expect(new ValidationError().errors).to.be.undefined;
    expect(new ValidationError({ foo: 'bar' }).errors).to.be.undefined;
    expect(new ValidationError({ errors: 'foo' }).errors).to.be.undefined;
    expect(new ValidationError({ errors: {} }).errors).to.be.undefined;
    expect(
      new ValidationError({
        errors: { foo: 'bar' },
      }).errors,
    ).to.be.undefined;
    expect(new ValidationError().errors).to.be.undefined;

    new ValidationError({ errors: { errors: 'foo' } }).errors.should.equal('foo');

    new ValidationError({
      errors: {
        errors: {
          name: ['The name attribute is required.'],
          email: ['The email attribute is required.'],
        },
      },
    }).errors.should.eql({
      name: ['The name attribute is required.'],
      email: ['The email attribute is required.'],
    });
  });
});
