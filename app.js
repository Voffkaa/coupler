$(document).ready(function() {

    'use strict';

    var DataModel = Backbone.Model.extend({

        defaults: {
            stepsNumber: 0,
            r: [1,1,1,1,1,1,1,1,1],
            result: ""
        },

        runStep: function() {

            var i = this.get('stepsNumber');
            var result = this.get('result');
            var r = this.get('r');

            var nextSymbol = r[6];
            var r5 = r[4];
            var r9 = r[8];

            var xor = (r5 !== r9);
            var newR0 = xor ? 1 : 0;

            r.unshift(newR0);
            r.pop();

            //console.log("Step: %s, XOR(r[5],r[9]): %s, r[0]: %s", i, xor, r[0]);

            this.set('stepsNumber', i + 1);
            this.set('result', nextSymbol + result);
            this.set('r', r);

            //console.log("Step: %s, result: %s", i, this.get('result'));

        },

        resetToDefaults: function() {

            this.set('stepsNumber', 0);
            this.set('result', '');
            this.set('r', [1,1,1,1,1,1,1,1,1]);
            
        }

    });

    var RegistersView = Backbone.View.extend({

        initialize: function() {

            this.model.on('change', this.render, this);

            this.render();
        },

        template: _.template($('#registers').html()),

        render: function() {

            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }

    });

    var ResultView = Backbone.View.extend({

        initialize: function() {

            this.model.on('change', this.render, this);

            this.render();
        },

        template: _.template($('#result').html()),

        render: function() {

            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }

    });

    window.app = {};
    app.data = new DataModel;
    app.registersView = new RegistersView({model: app.data});
    app.resultView = new ResultView({model: app.data});

    $('#registersValues').append(app.registersView.render().el);
    $('#resultValue').append(app.resultView.render().el);

    var intervalId;

    $('#runStep').click(function() {

        app.data.runStep();

    });

    $('#startRun').click(function() {

        intervalId = setInterval(function() {
            app.data.runStep();
        }, 200);

        $('#startRun').prop('disabled', true);
        $('#stopRun').prop('disabled', false);

    });

    $('#stopRun').click(function() {

        clearInterval(intervalId);
        $('#startRun').prop('disabled', false);
        $('#stopRun').prop('disabled', true);

    });

    $('#reset').click(function() {

        app.data.resetToDefaults();

    });

});
