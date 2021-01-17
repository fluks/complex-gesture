let dollar = new DollarRecognizer();

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

function getSquareSizeAndMapPoints(points) {
    let left = null, right = null, top = null, bottom = null;
    points.forEach(p => {
        if (left === null || p.X < left)
            left = p.X;
        if (right === null || p.X > right)
            right = p.X;
        if (top === null || p.Y < top)
            top = p.Y;
        if (bottom === null || p.Y > bottom)
            bottom = p.Y;
    });

    // Make box square.
    if (bottom - top > right - left)
        right += (bottom - top) - (right - left);
    else
        bottom += (right - left) - (bottom - top);
    const squareSize = bottom - top;

    // Map points to the new square.
    points = points.map(p => {
        return new Point(p.X - left, p.Y - top);
    });

    return [ points, squareSize ]
}

function gestureListener(req, sender, sendResponse) {
    const [ points, squareSize ] = getSquareSizeAndMapPoints(req.points);
    chrome.storage.local.get(null, options => {
        const r = dollar.Recognize(points, options.useProtractor, squareSize);
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

function optionsChanged(changes, area) {
    // Canvas in options is 400.
    const squareSize = 400;
    chrome.storage.local.get(null, options => {
        dollar = new DollarRecognizer();
        Object.keys(options.actions).forEach(k => {
            if (options.actions[k].points.length > 0) {
                dollar.AddGesture(k, options.actions[k].points, squareSize);
            }
        });
    });
}

chrome.runtime.onInstalled.addListener(setOptions);
chrome.storage.onChanged.addListener(optionsChanged);
chrome.runtime.onMessage.addListener(gestureListener);
