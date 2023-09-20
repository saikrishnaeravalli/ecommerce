var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var convertTimestamp = function (timestamp) {
    var d = new Date(timestamp),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh === 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    } else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    } else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};

//</editor-fold>

app.controller('ScreenshotReportController', ['$scope', '$http', 'TitleService', function ($scope, $http, titleService) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    this.warningTime = 1400;
    this.dangerTime = 1900;
    this.totalDurationFormat = clientDefaults.totalDurationFormat;
    this.showTotalDurationIn = clientDefaults.showTotalDurationIn;

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
        if (initialColumnSettings.warningTime) {
            this.warningTime = initialColumnSettings.warningTime;
        }
        if (initialColumnSettings.dangerTime) {
            this.dangerTime = initialColumnSettings.dangerTime;
        }
    }


    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };
    this.hasNextScreenshot = function (index) {
        var old = index;
        return old !== this.getNextScreenshotIdx(index);
    };

    this.hasPreviousScreenshot = function (index) {
        var old = index;
        return old !== this.getPreviousScreenshotIdx(index);
    };
    this.getNextScreenshotIdx = function (index) {
        var next = index;
        var hit = false;
        while (next + 2 < this.results.length) {
            next++;
            if (this.results[next].screenShotFile && !this.results[next].pending) {
                hit = true;
                break;
            }
        }
        return hit ? next : index;
    };

    this.getPreviousScreenshotIdx = function (index) {
        var prev = index;
        var hit = false;
        while (prev > 0) {
            prev--;
            if (this.results[prev].screenShotFile && !this.results[prev].pending) {
                hit = true;
                break;
            }
        }
        return hit ? prev : index;
    };

    this.convertTimestamp = convertTimestamp;


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };

    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.totalDuration = function () {
        var sum = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.duration) {
                sum += result.duration;
            }
        }
        return sum;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };


    var results = [
    {
        "description": "Currently Login Page is displayed|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e80073-00b2-0004-0025-006d0048001f.png",
        "timestamp": 1681100436959,
        "duration": 572
    },
    {
        "description": "Checking if username field exists|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00280030-004f-00b2-009d-006a00f400b7.png",
        "timestamp": 1681100437861,
        "duration": 18
    },
    {
        "description": "Checking username field position on the login page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00cf005f-00d1-006a-00b9-00ed008200fd.png",
        "timestamp": 1681100438186,
        "duration": 8
    },
    {
        "description": "Checking username field size on the login page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00aa006d-00c1-00f4-000b-003f00a20098.png",
        "timestamp": 1681100438489,
        "duration": 6
    },
    {
        "description": "Checking if password field exists|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0043006a-0092-00f9-0015-0005008800aa.png",
        "timestamp": 1681100438781,
        "duration": 13
    },
    {
        "description": "Checking password field position on the login page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ad0043-0051-0093-005c-009e000d0041.png",
        "timestamp": 1681100439084,
        "duration": 6
    },
    {
        "description": "Checking password field size on the login page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ca00f8-0087-00e7-0061-002c00d80007.png",
        "timestamp": 1681100439383,
        "duration": 5
    },
    {
        "description": "Checking if login button exists|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00060046-003c-00aa-00d6-005f00dd00c3.png",
        "timestamp": 1681100439660,
        "duration": 12
    },
    {
        "description": "Checking login button position on the login page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b90020-00d0-0061-00ad-002600510013.png",
        "timestamp": 1681100439948,
        "duration": 7
    },
    {
        "description": "Checking login button size on the login page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002c00e8-00a4-00cc-0010-00490054007c.png",
        "timestamp": 1681100440254,
        "duration": 7
    },
    {
        "description": "Checking the login button content|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e700d6-002c-00d1-0089-001900da000c.png",
        "timestamp": 1681100440563,
        "duration": 14
    },
    {
        "description": "Checking if application name exists on the login page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000a000b-00dd-0069-004e-00cf005f00d5.png",
        "timestamp": 1681100440869,
        "duration": 13
    },
    {
        "description": "Checking if text exists on the login page card|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000b0018-007c-00f8-0000-004a00680073.png",
        "timestamp": 1681100441180,
        "duration": 13
    },
    {
        "description": "Checking backgroundimage position on the login page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0021009f-0000-002e-001b-00dc002f007a.png",
        "timestamp": 1681100441484,
        "duration": 7
    },
    {
        "description": "Checking backgroundimage size on the login page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000a0087-00d4-004f-00cf-006a006f0066.png",
        "timestamp": 1681100441796,
        "duration": 5
    },
    {
        "description": "Logging into application and transferring from login page to dashboard page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00730016-00bd-0002-00fb-009200f4004f.png",
        "timestamp": 1681100442101,
        "duration": 944
    },
    {
        "description": "Currently Dashboard Page is displayed|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e60060-0052-00c1-00ca-00cb003d00f5.png",
        "timestamp": 1681100443290,
        "duration": 2
    },
    {
        "description": "Checking list size on the dashboard page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001e005b-0074-009c-00b7-003500300085.png",
        "timestamp": 1681100443520,
        "duration": 7
    },
    {
        "description": "Checking list location on the dashboard page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006300c9-00b3-00a1-00db-00df00f000b3.png",
        "timestamp": 1681100443736,
        "duration": 7
    },
    {
        "description": "Checking list existence on the dashboard page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003d000e-008b-0037-0073-002e00110070.png",
        "timestamp": 1681100444655,
        "duration": 9
    },
    {
        "description": "Checking content existence on the dashboard page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ba008e-0036-00ea-00bf-009b00ca00bc.png",
        "timestamp": 1681100445532,
        "duration": 11
    },
    {
        "description": "Checking content exact text on the dashboard page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00dc00aa-005d-0000-00f1-003c0086003b.png",
        "timestamp": 1681100446446,
        "duration": 9
    },
    {
        "description": "Checking view orders button existence on the dashboard page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006c0058-004e-00bf-00c7-006700c100cb.png",
        "timestamp": 1681100447360,
        "duration": 10
    },
    {
        "description": "Transferring from dashboard page to view orders page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00fa006c-004e-00d8-0013-00ec00aa00ec.png",
        "timestamp": 1681100448267,
        "duration": 30
    },
    {
        "description": "Currently View orders Page is displayed|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f10055-00e7-0037-009c-00b700d50091.png",
        "timestamp": 1681100448553,
        "duration": 2
    },
    {
        "description": "Checking content existence on the view orders page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00480016-0025-00ac-0020-002900fb00a3.png",
        "timestamp": 1681100448783,
        "duration": 9
    },
    {
        "description": "Checking content exact text on the view orders page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e500b8-0062-0022-0039-0083002c006c.png",
        "timestamp": 1681100449013,
        "duration": 8
    },
    {
        "description": "Checking content position on the view orders page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00bb0049-00ed-0069-0064-00bf005d00a5.png",
        "timestamp": 1681100449259,
        "duration": 5
    },
    {
        "description": "Checking content size on the view orders page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000f00f4-00a4-00ac-00f6-002600030082.png",
        "timestamp": 1681100449487,
        "duration": 5
    },
    {
        "description": "Checking log out button existence on the view orders page|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00590038-0043-0020-0035-006e008e00c3.png",
        "timestamp": 1681100449704,
        "duration": 12
    },
    {
        "description": "Logging out of the application|Testing Elements Location, Size, Content and Existence on Login page",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "0008004d-004c-0024-0002-00fa008e005a.png",
        "timestamp": 1681100449950,
        "duration": 20
    },
    {
        "description": "Logging into application and transferring from login page to dashboard page|Flow between the pages",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00dd0091-00de-009a-008c-006000ec00ce.png",
        "timestamp": 1681100450337,
        "duration": 774
    },
    {
        "description": "Transferring from dashboard page to view orders page|Flow between the pages",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002d0079-006e-0036-002c-00f7006100ab.png",
        "timestamp": 1681100451366,
        "duration": 23
    },
    {
        "description": "Transferring from view orders page to login page|Flow between the pages",
        "passed": true,
        "pending": false,
        "os": "Mac OS X",
        "instanceId": 43875,
        "browser": {
            "name": "chrome",
            "version": "112.0.5615.49"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0026002c-0025-0095-004a-006d00700047.png",
        "timestamp": 1681100451639,
        "duration": 25
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});

    };

    this.setTitle = function () {
        var title = $('.report-title').text();
        titleService.setTitle(title);
    };

    // is run after all test data has been prepared/loaded
    this.afterLoadingJobs = function () {
        this.sortSpecs();
        this.setTitle();
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    } else {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.afterLoadingJobs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.afterLoadingJobs();
    }

}]);

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

//formats millseconds to h m s
app.filter('timeFormat', function () {
    return function (tr, fmt) {
        if(tr == null){
            return "NaN";
        }

        switch (fmt) {
            case 'h':
                var h = tr / 1000 / 60 / 60;
                return "".concat(h.toFixed(2)).concat("h");
            case 'm':
                var m = tr / 1000 / 60;
                return "".concat(m.toFixed(2)).concat("min");
            case 's' :
                var s = tr / 1000;
                return "".concat(s.toFixed(2)).concat("s");
            case 'hm':
            case 'h:m':
                var hmMt = tr / 1000 / 60;
                var hmHr = Math.trunc(hmMt / 60);
                var hmMr = hmMt - (hmHr * 60);
                if (fmt === 'h:m') {
                    return "".concat(hmHr).concat(":").concat(hmMr < 10 ? "0" : "").concat(Math.round(hmMr));
                }
                return "".concat(hmHr).concat("h ").concat(hmMr.toFixed(2)).concat("min");
            case 'hms':
            case 'h:m:s':
                var hmsS = tr / 1000;
                var hmsHr = Math.trunc(hmsS / 60 / 60);
                var hmsM = hmsS / 60;
                var hmsMr = Math.trunc(hmsM - hmsHr * 60);
                var hmsSo = hmsS - (hmsHr * 60 * 60) - (hmsMr*60);
                if (fmt === 'h:m:s') {
                    return "".concat(hmsHr).concat(":").concat(hmsMr < 10 ? "0" : "").concat(hmsMr).concat(":").concat(hmsSo < 10 ? "0" : "").concat(Math.round(hmsSo));
                }
                return "".concat(hmsHr).concat("h ").concat(hmsMr).concat("min ").concat(hmsSo.toFixed(2)).concat("s");
            case 'ms':
                var msS = tr / 1000;
                var msMr = Math.trunc(msS / 60);
                var msMs = msS - (msMr * 60);
                return "".concat(msMr).concat("min ").concat(msMs.toFixed(2)).concat("s");
        }

        return tr;
    };
});


function PbrStackModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;
    ctrl.convertTimestamp = convertTimestamp;
    ctrl.isValueAnArray = isValueAnArray;
    ctrl.toggleSmartStackTraceHighlight = function () {
        var inv = !ctrl.rootScope.showSmartStackTraceHighlight;
        ctrl.rootScope.showSmartStackTraceHighlight = inv;
    };
    ctrl.applySmartHighlight = function (line) {
        if ($rootScope.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return '';
    };
}


app.component('pbrStackModal', {
    templateUrl: "pbr-stack-modal.html",
    bindings: {
        index: '=',
        data: '='
    },
    controller: PbrStackModalController
});

function PbrScreenshotModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;

    /**
     * Updates which modal is selected.
     */
    this.updateSelectedModal = function (event, index) {
        var key = event.key; //try to use non-deprecated key first https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
        if (key == null) {
            var keyMap = {
                37: 'ArrowLeft',
                39: 'ArrowRight'
            };
            key = keyMap[event.keyCode]; //fallback to keycode
        }
        if (key === "ArrowLeft" && this.hasPrevious) {
            this.showHideModal(index, this.previous);
        } else if (key === "ArrowRight" && this.hasNext) {
            this.showHideModal(index, this.next);
        }
    };

    /**
     * Hides the modal with the #oldIndex and shows the modal with the #newIndex.
     */
    this.showHideModal = function (oldIndex, newIndex) {
        const modalName = '#imageModal';
        $(modalName + oldIndex).modal("hide");
        $(modalName + newIndex).modal("show");
    };

}

app.component('pbrScreenshotModal', {
    templateUrl: "pbr-screenshot-modal.html",
    bindings: {
        index: '=',
        data: '=',
        next: '=',
        previous: '=',
        hasNext: '=',
        hasPrevious: '='
    },
    controller: PbrScreenshotModalController
});

app.factory('TitleService', ['$document', function ($document) {
    return {
        setTitle: function (title) {
            $document[0].title = title;
        }
    };
}]);


app.run(
    function ($rootScope, $templateCache) {
        //make sure this option is on by default
        $rootScope.showSmartStackTraceHighlight = true;
        
  $templateCache.put('pbr-screenshot-modal.html',
    '<div class="modal" id="imageModal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="imageModalLabel{{$ctrl.index}}" ng-keydown="$ctrl.updateSelectedModal($event,$ctrl.index)">\n' +
    '    <div class="modal-dialog modal-lg m-screenhot-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="imageModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="imageModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <img class="screenshotImage" ng-src="{{$ctrl.data.screenShotFile}}">\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <div class="pull-left">\n' +
    '                    <button ng-disabled="!$ctrl.hasPrevious" class="btn btn-default btn-previous" data-dismiss="modal"\n' +
    '                            data-toggle="modal" data-target="#imageModal{{$ctrl.previous}}">\n' +
    '                        Prev\n' +
    '                    </button>\n' +
    '                    <button ng-disabled="!$ctrl.hasNext" class="btn btn-default btn-next"\n' +
    '                            data-dismiss="modal" data-toggle="modal"\n' +
    '                            data-target="#imageModal{{$ctrl.next}}">\n' +
    '                        Next\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" href="{{$ctrl.data.screenShotFile}}" target="_blank">\n' +
    '                    Open Image in New Tab\n' +
    '                    <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>\n' +
    '                </a>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

  $templateCache.put('pbr-stack-modal.html',
    '<div class="modal" id="modal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="stackModalLabel{{$ctrl.index}}">\n' +
    '    <div class="modal-dialog modal-lg m-stack-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="stackModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="stackModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <div ng-if="$ctrl.data.trace.length > 0">\n' +
    '                    <div ng-if="$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer" ng-repeat="trace in $ctrl.data.trace track by $index"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                    <div ng-if="!$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in $ctrl.data.trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div ng-if="$ctrl.data.browserLogs.length > 0">\n' +
    '                    <h5 class="modal-title">\n' +
    '                        Browser logs:\n' +
    '                    </h5>\n' +
    '                    <pre class="logContainer"><div class="browserLogItem"\n' +
    '                                                   ng-repeat="logError in $ctrl.data.browserLogs track by $index"><div><span class="label browserLogLabel label-default"\n' +
    '                                                                                                                             ng-class="{\'label-danger\': logError.level===\'SEVERE\', \'label-warning\': logError.level===\'WARNING\'}">{{logError.level}}</span><span class="label label-default">{{$ctrl.convertTimestamp(logError.timestamp)}}</span><div ng-repeat="messageLine in logError.message.split(\'\\\\n\') track by $index">{{ messageLine }}</div></div></div></pre>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <button class="btn btn-default"\n' +
    '                        ng-class="{active: $ctrl.rootScope.showSmartStackTraceHighlight}"\n' +
    '                        ng-click="$ctrl.toggleSmartStackTraceHighlight()">\n' +
    '                    <span class="glyphicon glyphicon-education black"></span> Smart Stack Trace\n' +
    '                </button>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

    });
