const app = require('../../src/app');

describe('\'lesson-category\' service', () => {
  it('registered the service', () => {
    const service = app.service('lesson-category');
    expect(service).toBeTruthy();
  });
});
