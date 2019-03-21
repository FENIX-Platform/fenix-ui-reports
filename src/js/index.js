define([
    "jquery",
    "fenix-ui-bridge",
    "./validators/metadata",
    "./validators/table",
    "./validators/streaming",
    "./validators/flow",
    "loglevel"
], function ($, Bridge, Metadata, Table, Streaming, Flow, log) {

    'use strict';

    var PluginRegistry = {
        'metadata': Metadata,
        'table': Table,
        'streaming': Streaming,
        'flow': Flow
    };

    function Reports(o) {
        log.info("FENIX reports");
        log.info(o);

        var opts = o || {};

        this.channels = {};

        this.cache = opts.cache;

        this.environment = opts.environment;

        this.silent = opts.silent || false ;

        this.bridge = new Bridge({
            cache: this.cache,
            environment: this.environment,
            params: {language: "EN"},
            serviceProvider: opts.serviceProvider
        })
    }

    /**
     * pub/sub
     * @return {Object} component instance
     */
    Reports.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});
        return this;
    };

    /**
     * Export resource
     * @param obj {Object}
     * @return {Promise}
     */
    Reports.prototype.export = function (obj) {
        log.info("Export resource");
        log.info(obj);

        var params;
        if (PluginRegistry.hasOwnProperty(obj.format)) {
            log.info("format: " + obj.format);
            this._$pluginChosen = new PluginRegistry[obj.format];
        } else {
            log.error("Invalid format: " + obj.format);
            throw new Error('please define a valid plugin name');
        }

        var payload = this._$pluginChosen.process(obj.config);

        this._trigger("export.start", payload);

        if (payload.hasOwnProperty("options") && payload.options && payload.options !== null) {
            params = payload.options;
            delete payload.options;
        }


        switch (obj.format) {
            case "streaming":
                return this.bridge.exportStreaming(payload, params).then(
                    $.proxy(this._fulfillRequest, this),
                    $.proxy(this._rejectResponse, this));
                break;
            case "flow":
                return this.bridge.exportFlow(payload, params).then(
                    $.proxy(this._fulfillRequest, this),
                    $.proxy(this._rejectResponse, this));
                break;
            case "table":
            case "metadata" :
                return this.bridge.export(payload, params).then(
                    $.proxy(this._fulfillRequest, this),
                    $.proxy(this._rejectResponse, this));
                break;
        }
    };

    // end of API

    Reports.prototype._trigger = function (channel) {
        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }
        return this;
    };

    Reports.prototype._rejectResponse = function (value) {

        this._trigger("export.error");

        log.error("Error on resource export");
        log.error(value);

        if (!this.silent) alert("Error occurred during resource export.");

    };

    Reports.prototype._fulfillRequest = function (value) {

        this._trigger("export.success");


        log.info("Resource export success");
        log.info(value);

        var locUrl =
            (this._$pluginChosen.getName() !== 'table' && this._$pluginChosen.getName() !== 'metadata') ?
                value.url.substr(0, value.url.indexOf('export') + 'export'.length) + '/' + value.data :
                value.url + '?id=' + this._getParameterByName('id', value.data);

        window.location = locUrl;

    };

    Reports.prototype._getParameterByName = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    return Reports;
});