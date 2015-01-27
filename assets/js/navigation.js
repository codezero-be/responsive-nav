var $ = require('jquery');

var nav = function() {

    $('nav').on('click', 'a', function(event){
        event.preventDefault();
        return false;
    });

}

module.exports = nav;