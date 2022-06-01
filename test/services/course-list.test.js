const app = require('../../src/app');

describe('\'course-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('course-list');
    expect(service).toBeTruthy();
  });
});
