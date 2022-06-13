const app = require('../../src/app');

describe('\'lesson\' service', () => {
  it('registered the service', () => {
    const service = app.service('lesson');
    expect(service).toBeTruthy();
  });
});
