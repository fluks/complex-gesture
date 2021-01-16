let g_options = {},
    dollar = DollarRecognizer();

function setOptions(details) {
    if (details.reason === 'install') {
        const options = {
            useProtractor: false,
            minScore: 0.5,
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
        chrome.storage.local.set(options);
    }
    else if (details.reason === 'update') {
    }
}

function gestureListener(req, sender, sendResponse) {
    const squareSize = req.x > req.y ? req.x : req.y;
    chrome.storage.local.get(null, options => {
        const r = dollar.Recognize(req.points, options.useProtractor, squareSize);
        console.log(r.Name, r.Score);
        if (r.Score >= options.minScore) {
            if (options.actions[r.Name].code.background)
                eval(options.actions[r.Name].code.background);
            else {
                chrome.tabs.query({ active: true, }, tabs => {
                    chrome.tabs.sendMessage(tabs[0].id, { code: options.actions[r.Name].code.content, });
                });
            }
        }
    });
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
