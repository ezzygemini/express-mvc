const logger = require('logger').logger;
const DEFAULT_CONTENT_TYPE = '*/*';

class Request {

  /**
   * Handles the request based on method.
   * @param {HttpBasics} basics The HTTP Bascis.
   */
  doRequest(basics) {
    const req = basics.request;

    logger.debug({
      title: 'Request',
      message: `${req.method} ${req.hostname} ${req.originalUrl}`
    });

    if (!this.auth(basics)) {
      return this.unauthorizedError(basics);
    }

    const isForm = /multipart/i.test(basics.request.headers['content-type']);
    const qry = () => {
      if (basics.request.params.path) {
        return isNaN(basics.request.params.path) ?
          basics.request.params.path : parseFloat(basics.request.params.path);
      } else if (basics.request.originalUrl.indexOf('?') > -1) {
        return basics.request.query;
      }
    };

    switch (req.method) {
      case 'GET':

        if (this.authGet(basics)) {
          return this.doGet(basics, qry());
        } else {
          return this.unauthorizedError(basics);
        }

        break;
      case 'POST':

        if (this.authPost(basics)) {
          if (isForm) {
            return this.doPost(basics);
          } else {
            return basics.body()
              .catch(qry)
              .then(body => {
                try {
                  return this.doPost(basics, body);
                } catch (e) {
                  return this.internalServerError(basics);
                }
              });
          }
        } else {
          return this.unauthorizedError(basics);
        }

        break;
      case 'PATCH':

        if (this.authPatch(basics)) {
          if (isForm) {
            return this.doPatch(basics);
          } else {
            return basics.body()
              .catch(qry)
              .then(body => {
                try {
                  return this.doPatch(basics, body);
                } catch (e) {
                  return this.internalServerError(basics);
                }
              });
          }
        } else {
          return this.unauthorizedError(basics);
        }

        break;
      case 'DELETE':

        if (this.authDelete(basics)) {
          if (isForm) {
            return this.doDelete(basics);
          } else {
            return basics.body()
              .catch(qry)
              .then(body => {
                try {
                  return this.doDelete(basics, body);
                } catch (e) {
                  return this.internalServerError(basics);
                }
              });
          }
        } else {
          return this.unauthorizedError(basics);
        }

        break;
      case 'PUT':

        if (this.authPut(basics)) {
          if (isForm) {
            return this.doPut(basics);
          } else {
            return basics.body()
              .catch(qry)
              .then(body => {
                try {
                  return this.doPut(basics, body);
                } catch (e) {
                  return this.internalServerError(basics);
                }
              });
          }
        } else {
          return this.unauthorizedError(basics);
        }

        break;
      default:

        if (isForm) {
          return this.badRequestError(basics);
        } else {
          return basics.body()
            .catch(qry)
            .then(body => this.badRequestError(basics, body)
              .catch(e => this.internalServerError(basics)));
        }

    }
  }

  /**
   * Obtains the options of the api.
   * @returns {*}
   */
  get options() {
  }

  /**
   * Authorizes the request of all methods.
   * @param {HttpBasics} basics The http basics.
   * @returns {boolean}
   */
  auth(basics) {
    return true;
  }

  /**
   * Authorizes the request and checks if we can continue with a GET request.
   * @param {HttpBasics} basics The http basics.
   * @returns {boolean}
   */
  authGet(basics) {
    return true;
  }

  /**
   * Basic GET handler.
   * @param {HttpBasics} basics The http basics.
   * @param {*=} data The data sent on the body.
   */
  doGet(basics, data) {
    this.sendStatus(basics, 501);
    basics.response.end();
  }

  /**
   * Indicates what content type is accepted on GET requests.
   * @returns {string}
   */
  get acceptGet() {
    return DEFAULT_CONTENT_TYPE;
  }

  /**
   * Authorizes the request and checks if we can continue with a POST request.
   * @param {HttpBasics} basics The http basics.
   * @returns {boolean}
   */
  authPost(basics) {
    return true;
  }

  /**
   * Basic POST handler.
   * @param {HttpBasics} basics The http basics.
   * @param {*=} data The data sent on the body.
   */
  doPost(basics, data) {
    this.sendStatus(basics, 501);
    basics.response.end();
  }

  /**
   * Indicates what content type is accepted on POST requests.
   * @returns {string}
   */
  get acceptPost() {
    return DEFAULT_CONTENT_TYPE;
  }

  /**
   * Authorizes the request and checks if we can continue with a PATCH request.
   * @param {HttpBasics} basics The http basics.
   * @returns {boolean}
   */
  authPatch(basics) {
    return true;
  }

  /**
   * Basic PATCH handler.
   * @param {HttpBasics} basics The http basics.
   * @param {*=} data The data sent on the body.
   */
  doPatch(basics, data) {
    this.sendStatus(basics, 501);
    basics.response.end();
  }

  /**
   * Indicates what content type is accepted on PATCH requests.
   * @returns {string}
   */
  get acceptPatch() {
    return DEFAULT_CONTENT_TYPE;
  }

  /**
   * Authorizes the request and checks if we can continue with a DELETE request.
   * @param {HttpBasics} basics The http basics.
   * @returns {boolean}
   */
  authDelete(basics) {
    return true;
  }

  /**
   * Basic DELETE handler.
   * @param {HttpBasics} basics The http basics.
   * @param {*=} data The data sent on the body.
   */
  doDelete(basics, data) {
    this.sendStatus(basics, 501);
    basics.response.end();
  }

  /**
   * Indicates what content type is accepted on DELETE requests.
   * @returns {string}
   */
  get acceptDelete() {
    return DEFAULT_CONTENT_TYPE;
  }

  /**
   * Authorizes the request and checks if we can continue with a PUT request.
   * @param {HttpBasics} basics The http basics.
   * @returns {boolean}
   */
  authPut(basics) {
    return true;
  }

  /**
   * Basic PUT handler.
   * @param {HttpBasics} basics The http basics.
   * @param {*=} data The data sent on the body.
   */
  doPut(basics, data) {
    this.sendStatus(basics, 501);
    basics.response.end();
  }

  /**
   * Indicates what content type is accepted on PUT requests.
   * @returns {string}
   */
  get acceptPut() {
    return DEFAULT_CONTENT_TYPE;
  }

  /**
   * Sends a 500 error on the page.
   * @param {HttpBasics} basics The http basics.
   * @param {number} status The request status to send.
   */
  sendStatus(basics, status = 200) {
    if (status !== 200) {
      logger.warn(`Sending ${status} status`);
    } else {
      logger.debug(`Sending ${status} status`);
    }
    basics.response.status(status);
  }

  /**
   * Sends a bad-request message response.
   * @param {HttpBasics} basics The http basics.
   */
  badRequestError(basics) {
    return this.sendStatus(basics, 400);
  }

  /**
   * Sends an unauthorized message response.
   * @param {HttpBasics} basics The http basics.
   */
  unauthorizedError(basics) {
    return this.sendStatus(basics, 400);
  }

  /**
   * Sends a server-error message response.
   * @param {HttpBasics} basics The http basics.
   */
  internalServerError(basics) {
    return this.sendStatus(basics, 500);
  }

}

module.exports = Request;
