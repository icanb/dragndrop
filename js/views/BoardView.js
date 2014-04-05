define(function(require, exports, module) {

    'use strict';

    require('backbone');

    var ShapeModel = require('data/ShapeModel');
    var CircleView = require('views/CircleView');
    var SquareView = require('views/SquareView');


    var BoardView = Backbone.View.extend({

        mode: "circle",

        events: {
            'click .canvas': 'addShape',
            'click .save'  : 'save',
            'click .load'  : 'load',
            'click .shape' : 'switchMode',
            // make the circle and square change the mode property
        },

        initialize: function(options) {
            _.bindAll(this);

            this.model = options.model;
            // listeners (read(or ask me) more about observer pattern)
            this.listenTo(this.model.get('shapes'), 'add', this.renderShape);
            this.listenTo(this.model, 'reset', this.reset);

        },

        save: function() {
            this.model.saveLocal('paint');
        },

        load: function() {
            this.model.loadLocal('paint');
        },

        reset: function() {
            this.listenTo(this.model.get('shapes'), 'add', this.renderShape);
            this.canvasDiv.innerHTML = '';
            this.renderShapes();
        },

        render: function() {

            var templateStr = [
                '<div class="right-panel">',
                '<% _.each(shapes, function(shapeStr) { %>',
                '<div data-type="<%= shapeStr %>" class="shape"><%= shapeStr %></div>',
                '<% }); %>',
                '<div class="save btn">Save</div>',
                '<div class="load btn">Load</div>',
                '</div>'
            ].join('\n');

            var availableShapes = ['circle', 'square'];
            this.el.innerHTML = _.template(templateStr, {  shapes: availableShapes});

            this.$el.find( ".shape" ).draggable({
                helper: "clone",
                stop: this.shapeDropped
            });


            this.$el.find('[data-type="'+ this.mode +'"]').addClass('active');

            var canvasDiv = document.createElement('div');
            canvasDiv.id = "canvas";
            canvasDiv.className = "canvas";
            this.canvasDiv = canvasDiv;

            this.el.appendChild(canvasDiv);

            this.renderShapes();

            return this;
        },

        shapeDropped: function(e) {
            var type = e.target.dataset.type;
            var y = this.findTop(e);
            var x = this.findLeft(e);

            this.model.addShape(type, x, y);
        },

        findLeft: function(e) {
            var offsetLeft = this.$el.offset().left;
            var left = Math.round(e.pageX - offsetLeft);
            return left;
        },

        findTop: function(e) {
          var offsetScrolledTop = this.$el.offset().top;
          var top  = Math.round(e.pageY - offsetScrolledTop);
          return top;
        },

        renderShapes: function() {
            this.model.get('shapes').each(function(shapeModel) {
                this.renderShape(shapeModel);
            }, this);
        },

        renderShape: function(shapeModel) {

            // support Square shapes here
            if (shapeModel.get('type') == "circle") {
                var shapeView = new CircleView(shapeModel);
                this.canvasDiv.appendChild(shapeView.render().el);
            }

            if (shapeModel.get('type') == "square") {
                var squareView = new SquareView(shapeModel);
                this.canvasDiv.appendChild(squareView.render().el);
            }

        },

        addShape: function(e) {
            var coord = this.getCoordinates(e);

            var shapeModel = new ShapeModel(coord);
            if (this.mode == "circle") {
                shapeModel.setType('circle');
            }
            if (this.mode == "square") {
                shapeModel.setType('square');
            }
            this.model.get('shapes').add(shapeModel);
        },

        getCoordinates: function(e) {
            var x;
            var y;
            if (e.pageX || e.pageY) {
                x = e.pageX;
                y = e.pageY;
            } else {
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }

            x -= this.canvasDiv.getBoundingClientRect().left + 30;
            y -= this.canvasDiv.getBoundingClientRect().top + 30;

            return {xCoord: x, yCoord: y};
        },

        switchMode: function(e) {
            var mode = e.currentTarget.dataset.type;
            this.mode = mode;
            this.$el.find('.active').removeClass('active');
            this.$el.find('[data-type="' + mode + '"]').addClass('active');
        },


    });

    return BoardView;
});