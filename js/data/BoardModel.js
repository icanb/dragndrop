define(function(require, exports, module) {
     
    'use strict';

    require('backbone');
    var ShapeCollection = require('data/ShapeCollection');

    var BoardModel = Backbone.Model.extend({

        initialize: function(bone) {
            var collection = new ShapeCollection(bone.shapes||[]);
            this.set('shapes', collection);
        },

        addShape: function(type, x, y) {
            console.log(x);
            this.get('shapes').push({
                xCoord: x,
                yCoord: y,
                type: type
            });
        },

        toJSON: function() {
            var json = _.clone(this.attributes);

            // need to call toJSON on nested collections and models
            json.shapes = json.shapes.toJSON();
            return json;
        }

    });

    return BoardModel;

});