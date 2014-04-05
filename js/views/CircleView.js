define(function(require, exports, module) {

    'use strict';
    require('backbone');

    var CircleView = Backbone.View.extend({

        className: 'shape-widget circle',

        events: {
            'click' : 'removeModel'
        },

        initialize: function(shapeModel) {
            _.bindAll(this);
            this.model = shapeModel;
            this.listenTo(this.model, 'remove', this.removeView);
        },

        render: function() {
            
            this.el.style.left = this.model.get('xCoord') + 'px';
            this.el.style.top  = this.model.get('yCoord') + 'px';

            return this;
        },

        removeModel: function() {
            this.model.collection.remove(this.model);
        },

        removeView: function() {
            this.$el.remove();
        }

    });


    return CircleView;
});