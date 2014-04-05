require.config({
  paths: {
    "jquery"          : "./libs/jquery.min",
    "underscore"      : "./libs/underscore-min",
    "backbone"        : "./libs/backbone",
    "backbone-mixins" : "./BackboneMixins",
    "views"           : "./views",
    "data"            : "./data"
  },

  shim: {
    "underscore": {
      exports: "_"
    },
    "backbone": {
      exports: "Backbone",
      deps: ["underscore", "jquery"]
    },
    "backbone-mixins" : {
      exports: "Backbone",
      deps: ["backbone"]
    }
  }

});

require(['views/BoardView',
         'data/BoardModel',
         'backbone',
         'backbone-mixins'], function(BoardView, BoardModel) {

  'use strict';

  $(document).ready(function() {
      console.log("Document is loaded.");

      var initialBoard = {
        "shapes": [
          {
            "xCoord": 192.5,
            "yCoord": 130,
            "type": "circle"
          },
          {
            "xCoord": 420.5,
            "yCoord": 125,
            "type": "circle"
          }
        ]
      }

      // creating the main model for the board
      var boardModel = new BoardModel(initialBoard);
      // getting the board node
      var boardDiv = document.getElementById('board');
      // initialized
      var boardView = new BoardView({ model: boardModel });
      // element set and then rendered
      boardView.setElement(boardDiv).render();
  });

});
