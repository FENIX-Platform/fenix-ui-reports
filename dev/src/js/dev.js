define([
    'loglevel',
    'jquery',
    'underscore',
    '../../../src/js/index',
    '../json/uneca_population.json',
    '../json/flow_wiews.json',
    '../json/streaming_wiews.json'
], function (log, $, _, Reports, Model, Flow, Streaming) {

    'use strict';

    var instances = [],
        lang = "EN",
        cache = false,
        model = Model,
        flow_model = Flow,
        streaming_model = Streaming,
        uid = "indicator20",
        template = "fao",
        environment = "demo"; //"develop" || "production",

    function Dev() {
        console.clear();

        this._importThirdPartyCss();

        log.setLevel('trace')
        this.start();
    }

    Dev.prototype.start = function () {

        log.trace("Test started");

        this._render();

    };

    Dev.prototype._render = function () {

        var self = this;

        $("[data-format]").each(function () {

            var $this = $(this),
                format = $this.data("format");

            $this.on("click", {format: format}, function (e) {
                e.preventDefault();

                log.info("Export as: " + format);

                self._export(format)

            });
        });

    };

    Dev.prototype._export = function (format) {

        this.report = this._createInstance({
            environment: environment,
            cache: cache
        });

        switch (format) {
            case "table" :

                var payload = {
                    resource: model,
                    input: {
                        config: {}
                    },
                    output: {
                        config: {
                            lang: lang.toUpperCase()
                        }
                    }
                };

                log.info("Configure FENIX export: table");

                log.info(payload);

                this.report.export({
                    format: "table",
                    config: payload
                });

                break;
            case "metadata" :

                var payload = {
                    resource: {
                        metadata: {
                            uid: uid
                        },
                        data: []
                    },
                    input: {
                        config: {}
                    },
                    output: {
                        config: {
                            template: template,
                            lang: lang.toUpperCase(),
                            fileName: 'fx_report_test.pdf'
                        }
                    }
                };

                log.info("Configure FENIX export: metadata");

                log.info(payload);

                this.report.export({
                    format: "metadata",
                    config: payload
                });

                break;

            case "flow" :

                this.report.export ({
                    format : "flow",
                    config : flow_model
                });
                break;


            case "streaming" :
                this.report.export ({
                    format : "streaming",
                    config : streaming_model
                });
                break;


            default:
                alert(format + " is not valid format");
        }
    };

    Dev.prototype._createInstance = function (params) {

        var instance = new Reports(params);

        instances.push(instance);

        return instance;
    };

    // utils

    Dev.prototype._importThirdPartyCss = function () {

        //Bootstrap
        require("bootstrap-loader");

    };

    return new Dev();

});