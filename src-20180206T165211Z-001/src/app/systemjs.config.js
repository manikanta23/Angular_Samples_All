/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            "npm:": "/node_modules/"
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: "/src/app",
            // angular bundles
            "@angular/core": "npm:@angular/core/bundles/core.umd.js",
            "@angular/common": "npm:@angular/common/bundles/common.umd.js",
            "@angular/compiler": "npm:@angular/compiler/bundles/compiler.umd.js",
            "@angular/platform-browser": "npm:@angular/platform-browser/bundles/platform-browser.umd.js",
            "@angular/platform-browser-dynamic": "npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js",
            "@angular/http": "npm:@angular/http/bundles/http.umd.js",
            "@angular/router": "npm:@angular/router/bundles/router.umd.js",
            "@angular/forms": "npm:@angular/forms/bundles/forms.umd.js",
            'ng2-auto-complete': 'npm:ng2-auto-complete/dist',
            // other libraries
            "rxjs": "npm:rxjs",
            "angular2-in-memory-web-api": "npm:angular2-in-memory-web-api",
            //for Datatable
            "angular2-datatable": "npm:angular2-datatable",
            //lodash is similar to underscore
            "lodash": "npm:lodash/lodash.js",
            'ts-clipboard': 'npm:ts-clipboard/ts-clipboard.js',
            'ng2-appinsights': 'npm:ng2-appinsights',
            'angular2-highcharts': 'npm:angular2-highcharts',
            'highcharts': 'npm:highcharts',
            "ngx-popover": "npm:ngx-popover",
            "ng2-cookies": "npm:ng2-cookies",
            "ngx-accordion": "node_modules/ngx-accordion"
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: "./main.js",
                defaultExtension: "js"
            },
            rxjs: {
                main: "./Rx.js",
                defaultExtension: "js"
            },
            "angular2-in-memory-web-api": {
                main: "./index.js",
                defaultExtension: "js"
            },
            "@angular/router-deprecated": {
                main: "index.js",
                defaultExtension: "js"
            },
            "angular2-datatable": {
                main: "index.js",
                defaultExtension: "js"
            },
            'ng2-auto-complete': {
                main: 'ng2-auto-complete.umd.js',
                defaultExtension: 'js'
            },
            'ng2-appinsights': {
                //main: 'Path to the main of ng2-appinsights'
                main: 'bundles/ng2-appinsights.js',
                defaultExtension: 'js'
            },
            highcharts: {
                main: './highcharts.js',
                defaultExtension: 'js'
            },
            'angular2-highcharts': {
                main: './index.js',
                defaultExtension: 'js'
            },
            "ngx-popover": { main: "index.js", "defaultExtension": "js" },
            "ng2-cookies": { main: "index.js", "defaultExtension": "js" },
            "ngx-accordion": { "main": "index.js", "defaultExtension": "js" }
        }
    });
})(this);