define([
    'jquery'
], function ($) {

    'use strict';

    function FlowValidator() {

        this.errors = {
            plugin_not_exists: "the output plugin does not exists",
            data_or_md_not_exists: "please set metadata and data into configuration specified",
            language_not_exists: "language in the config does not exists",
            configuration_wrong: "please check the configuration"
        };

        this.name = "streaming";

        this.languagesAdmitted = {
            EN: true,
            FR: true,
            ES: true
        };
    }

    FlowValidator.prototype.process = function (config) {
        /* Extend default configuration. */
        if (this.validateConfig(config)) {
            this.CONFIG = $.extend(true, {}, this.CONFIG, config);
        }
        return this.CONFIG;
    };


    FlowValidator.prototype.validateConfig = function (config) {

        /*  var result = false;
         // check data and metadata
         if (typeof config.input !== 'undefined' && config.input != null
         && config.resource && config.resource.metadata && config.resource.metadata.uid
         && config.resource.metadata.uid !== null && config.resource.metadata.uid !== '') {
         result = true;


         } else {
         throw this.errors.data_or_md_not_exists;
         }

         return result;*/ //TODO
        return true;
    };

    FlowValidator.prototype.getName = function () {
        return this.name;
    };


    return FlowValidator;
});