var request         = require("request");

module.exports = (knex) => {
  return{

    getUserIdByToken:  (token) => {
      return new Promise(function(resolve, reject) {
        knex
          .select("*")
          .from("users")
          .where('token', token)
          .then( results => results.length === 1 ? resolve( results[0].id ) : reject('user not found') )
          .catch(e => reject( e ));
      })
    },

    getUserToken: (req, res) => {

      if(!req.params.userToken || req.params.userToken === '' || !req.session.user_id || req.session.user_id === ''){
        return { error: 'Please login or register', user: null} ;
      }

      let token = undefined;

      if(req.params.hasOwnProperty('userToken')){
        token = req.params.userToken;
      }
      if(req.session.hasOwnProperty('user_id')){
        token = req.session.user_id;
      }
      return token;
    }
  }
};
