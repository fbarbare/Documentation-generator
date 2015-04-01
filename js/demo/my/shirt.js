//Explicitly defines the "foo/title" module:
define([
		"my"
], function(my) {
        //Define foo/title object in here.
        return {
        	foo: 'bar',
        	title: 'title',
        	my : my
        }
   }
);