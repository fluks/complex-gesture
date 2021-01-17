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
                },
                'Next tab': {
                    custom: false,
                    points: [],
                },
                'Previous page': {
                    custom: false,
                    points: [],
                },
                'Next page': {
                    custom: false,
                    points: [],
                },
                'Open new tab': {
                    custom: false,
                    points: [],
                },
                'Close current tab': {
                    custom: false,
                    points: [],
                },
                'Reload current tab': {
                    custom: false,
                    points: [],
                },
                'Bookmark tab': {
                    custom: false,
                    points: [],
                },
                'Scroll to top': {
                    custom: false,
                    points: [],
                },
                'Scroll to bottom': {
                    custom: false,
                    points: [],
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
            if (r.Name === 'Previous tab') {
                const indexActive = sender.tab.index;
                chrome.tabs.query({ index: indexActive - 1, }, tabs => {
                    chrome.tabs.update(tabs[0].id, { active: true, });
                });
            }
            else if (r.Name === 'Next tab') {
                const indexActive = sender.tab.index;
                chrome.tabs.query({ index: indexActive + 1, }, tabs => {
                    chrome.tabs.update(tabs[0].id, { active: true, });
                });
            }
            else if (r.Name === 'Previous page') {
                chrome.tabs.goBack();
            }
            else if (r.Name === 'Next page') {
                chrome.tabs.goForward();
            }
            else if (r.Name === 'Open new tab') {
                const indexActive = sender.tab.index;
                chrome.tabs.create({ index: indexActive + 1, });
            }
            else if (r.Name === 'Close current tab') {
                const id = sender.tab.id;
                chrome.tabs.remove(id);
            }
            else if (r.Name === 'Reload current tab') {
                chrome.tabs.reload();
            }
            else if (r.Name === 'Bookmark tab') {
            }
            else if (r.Name === 'Scroll to top') {
                chrome.tabs.query({ active: true, }, tabs => {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'Scroll to top', });
                });
            }
            else if (r.Name === 'Scroll to bottom') {
                chrome.tabs.query({ active: true, }, tabs => {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'Scroll to bottom', });
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
