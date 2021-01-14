let g_options = {},
    dollar = DollarRecognizer();

function setOptions(details) {
    if (details.reason === 'install') {
        g_options = {
            actions: {
                'Previous tab': {
                    custom: false,
                    points: [],
                    code: '',
                },
                'Next tab': {
                    custom: false,
                    points: [],
                    code: '',
                },
                'Previous page': {
                    custom: false,
                    points: [],
                    code: '',
                },
                'Next page': {
                    custom: false,
                    points: [],
                    code: '',
                },
                'Open new tab': {
                    custom: false,
                    points: [],
                    code: '',
                },
                'Close current tab': {
                    custom: false,
                    points: [],
                    code: '',
                },
                'Reload current tab': {
                    custom: false,
                    points: [],
                    code: '',
                },
                'Bookmark tab': {
                    custom: false,
                    points: [],
                    code: '',
                },
                'Scroll to top': {
                    custom: false,
                    points: [],
                    code: '',
                },
                'Scroll to bottom': {
                    custom: false,
                    points: [],
                    code: '',
                },
            },
        };
        chrome.storage.local.set(g_options);
    }
    else if (details.reason === 'update') {
    }
}

function gestureListener(req, sender, sendResponse) {
    const useProtractor = false;
    const r = dollar.recognize(req.points, useProtractor);
    console.log(r.Name, r.Score);
    if (r.Score >= minScore) {
        eval(g_options.actions[r.Name].code);
    }
}

function(changes, area) {
    const o = chrome.storage.local.get(null);
    o.then(options => {
        dollar = DollarRecognizer();
        Object.keys(options.actions).forEach(k => {
            dollar.addGesture(k, options.actions[k].points);
        })
    });
}

chrome.runtime.onInstalled.addListener(setOptions);
chrome.storage.onChanged.addListener(optionsChanged);
chrome.runtime.onMessage.addListener(gestureListener);
