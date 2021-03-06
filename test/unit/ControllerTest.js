const ExpressMvc = require('../../src/ExpressMvc');
let expressMvc;
const logger = require('ezzy-logger').logger;

describe('Controller', () => {

  beforeAll(() => logger.silence());

  beforeEach(() => expressMvc = new ExpressMvc({
    directory: __dirname + '/../../root',
    partialsDirectories: [
      __dirname + '/../../root/someRandomDirectory',
      __dirname + '/../../root2/anotherRandomDirectory'
    ]
  }));

  it('should render a handlebars template properly', done => {
    expressMvc.getController('MyController')
      .then(controller => {
        controller.render({request:{assets:{}}}).then(data => {
          expect(data).toContain('<h1>Hello World</h1>');
          done();
        });
      });
  });

  it('should contain a proper partial from the partials directory', done => {
    expressMvc.getController('MyController')
      .then(controller => {
        controller.render({request:{assets:{}}}).then(data => {
          expect(data).toContain('<i>Testing Partial</i>');
          done();
        })
      })
  });

  it('should contain a proper partial from a sub-partial directory', done => {
    expressMvc.getController('MyController')
      .then(controller => {
        controller.render({request:{assets:{}}}).then(data => {
          expect(data).toContain('<i>Testing Another Partial</i>');
          done();
        })
      })
  });

  afterAll(() => logger.talk());

});
