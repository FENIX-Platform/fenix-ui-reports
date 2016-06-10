define(function () {

    var config = {
        paths: {
            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'amplify': '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            "fx-rp-plugins-factory": "./factory/PluginsFactory",
            "fx-rp-metadata": "./plugins/metadata/MetadataValidator",
            "fx-rp-table": "./plugins/table/TableValidator",
            "fx-rp-surveyFMD": "./plugins/fmd/FMDValidator",
            "fx-reports/start": "./reports",
            "fx-reports/config": "../../config",

        },
        shim: {
            'amplify': {
                deps: ['jquery']
            },
            'fx-rp-plugins-factory': {
                deps: ['fx-rp-metadata', 'fx-rp-table', 'fx-rp-surveyFMD']
            }
        }
    };

    return config;
});