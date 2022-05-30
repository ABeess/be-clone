const app = require('../../src/app');

describe('\'course-category\' service', () => {
  it('registered the service', () => {
    const service = app.service('course-category');
    expect(service).toBeTruthy();
  });
});
