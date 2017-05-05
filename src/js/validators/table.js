define([
    'jquery'
], function ($) {

    'use strict';

    function TableValidator() {

        this.errors = {
            plugin_not_exists: "the output plugin does not exists",
            data_or_md_not_exists: "please set metadata and data into configuration specified",
            language_not_exists: "language in the config does not exists",
            configuration_wrong: "please check the configuration"
        };

        this.name = "table";

        this.languagesAdmitted = {
            EN: true,
            FR: true,
            ES: true
        };
        this.CONFIG = {

            "resource": {
                "metadata": {},
                "data": []
            },
            "input": {
                "plugin": "inputTable",
                "config": {}
            },
            "output": {
                "plugin": "outputTable",
                "config": {
                    "lang": "EN"
                }
            }
        };

    }

    TableValidator.prototype.process = function (config) {
        /* Extend default configuration. */
        if (this.validateConfig(config)) {
            this.CONFIG = $.extend(true, {}, this.CONFIG, config);
        }
        return this.CONFIG;
    };


    TableValidator.prototype.validateConfig = function (config) {

        var result = false;
        // check data and metadata
        if (typeof config.input !== 'undefined' && config.input != null
            && config.resource && config.resource.metadata && config.resource.metadata.uid
            && config.resource.metadata.uid !== null && config.resource.metadata.uid !== '') {
            result = true;


        } else {
            throw this.errors.data_or_md_not_exists;
        }

        return result;
    };


    TableValidator.prototype.getName = function () {
        return this.name;
    }


    return TableValidator;
});