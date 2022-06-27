const app = require('../../src/app');

describe('\'comment\' service', () => {
  it('registered the service', () => {
    const service = app.service('comment');
    expect(service).toBeTruthy();
  });
});
