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
                    code: {
                        background: `
                            const indexActive = sender.tab.index;
                            chrome.tabs.query({ index: indexActive - 1, }, tabs => {
                                chrome.tabs.update(tabs[0].id, { active: true, });
                            });
                        `,
                        content: '',
                    },
                },
                'Next tab': {
                    custom: false,
                    points: [],
                    code: {
                        background: `
                            const indexActive = sender.tab.index;
                            chrome.tabs.query({ index: indexActive + 1, }, tabs => {
                                chrome.tabs.update(tabs[0].id, { active: true, });
                            });
                        `,
                        content: '',
                    },
                },
                'Previous page': {
                    custom: false,
                    points: [],
                    code: {
                        background: 'chrome.tabs.goBack();',
                        content: '',
                    },
                },
                'Next page': {
                    custom: false,
                    points: [],
                    code: {
                        background: 'chrome.tabs.goForward();',
                        content: '',
                    },
                },
                'Open new tab': {
                    custom: false,
                    points: [],
                    code: {
                        background: `
                            const indexActive = sender.tab.index;
                            chrome.tabs.create({ index: indexActive + 1, });
                        `,
                        content: '',
                    },
                },
                'Close current tab': {
                    custom: false,
                    points: [],
                    code: {
                        background: `
                            const id = sender.tab.id;
                            chrome.tabs.remove(id);
                        `,
                        content: '',
                    },
                },
                'Reload current tab': {
                    custom: false,
                    points: [],
                    code: {
                        background: 'chrome.tabs.reload();',
                        content: '',
                    },
                },
                'Bookmark tab': {
                    custom: false,
                    points: [],
                    code: {
                        background: '',
                        content: '',
                    },
                },
                'Scroll to top': {
                    custom: false,
                    points: [],
                    code: {
                        background: '',
                        content: 'window.scrollTo(0, 0);',
                    },
                },
                'Scroll to bottom': {
                    custom: false,
                    points: [],
                    code: {
                        background: '',
                        content: 'window.scrollTo(0, document.body.scrollHeight);',
                    },
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
