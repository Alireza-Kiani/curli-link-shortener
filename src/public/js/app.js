function detectSystemTheme() {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? 'dark' : 'light'
}
function getTheme() {
    let theme = localStorage.getItem('theme');
    if (theme != null) {
        return theme
    } else {
        localStorage.setItem('theme', detectSystemTheme())
    }
}
function changeTheme(isDarkMode) {
    isDarkMode ? localStorage.setItem('theme', 'dark') : localStorage.setItem('theme', 'light')
}
function isValidUrl(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1, 3}\\.){3}\\d{1, 3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
new Vue({
    el: '#application',
    data: () => ({
        // app states: pre-cut, fetching, post-cut
        state: 'pre-cut',
        Notifications: {
            invalidUrl: {
                icon: 'error_outline',
                text: 'Enter A Valid URL',
                isShown: false,
                classes: []
            },
            connectionError: {
                icon: 'signal_wifi_statusbar_connected_no_internet_4',
                text: 'Server Connection Error!',
                isShown: false,
                classes: []
            },
            connectionError: {
                icon: 'signal_wifi_statusbar_connected_no_internet_4',
                text: 'Server Connection Error!',
                isShown: false,
                classes: []
            },
            clipboardSuccess: {
                icon: 'check',
                text: 'Successfully Copied To Clipboard',
                isShown: false,
                classes: []
            },
            cutSuccess: {
                icon: 'link',
                text: 'Your Link Has Been Shortened',
                isShown: false,
                classes: []
            }
        },
        darkMode: null,
        menu: false,
        input: null,
        shortenedValue: null
    }),
    beforeMount() {
        this.darkMode = getTheme() === 'dark' ? true : false
    },
    computed: {
        notDarkMode: {
            set: function () {
                this.darkMode = !this.darkMode
                changeTheme(this.darkMode)
            },
            get: function () {
                return !this.darkMode
            }
        }
    },
    methods: {
        handleKeyboard(event) {
            switch (event.keyCode) {
                case 8:
                    this.state = 'pre-cut'
                    break
                case 13:
                    if (this.state === 'pre-cut') this.cut()
                    else this.copy()
                    break
                case 27:
                    this.clearInput()
                    break
                default:
                    if (this.state === 'post-cut') this.state = 'pre-cut'
                    // console.log('🎹', event)
                    break
            }

        },
        copy() {
            var Url = this.$refs.shortenedValue;
            Url.innerHTML = window.location.href;
            Url.setAttribute('type', 'text')
            Url.select();
            document.execCommand("copy");
            Url.setAttribute('type', 'hidden')
            document.getSelection().removeAllRanges() //deselect input
            this.Notifications.clipboardSuccess.isShown = true
            setTimeout(() => {
                this.Notifications.clipboardSuccess.isShown = false
            }, 3000)
        },
        toggleTheme() {
            this.darkMode = !this.darkMode
            changeTheme(this.darkMode)
        },
        toggleMenu() {
            this.menu = !this.menu
        },
        clearInput() {
            this.input = null
            this.state = 'pre-cut'
        },
        async cut() {
            let result;
            if (isValidUrl(this.input)) {
                this.state = 'fetching'
                try {
                    const response = await fetch('/shortener', {
                        method: 'post',
                        body: JSON.stringify({
                            link: this.input
                        }),
                        headers: {
                            'content-type': 'application/json'
                        },
                        redirect: 'follow'
                    })
                    result = await response.json()
                    if (result.shortLink) {
                        this.state = 'post-cut'
                        this.shortenedValue = 'https://curli.ir/' + result.shortLink
                        this.input = 'curli.ir/' + result.shortLink
                        this.Notifications.cutSuccess.isShown = true
                        setTimeout(() => {
                            this.Notifications.cutSuccess.isShown = false
                        }, 3000)
                    } else {
                        this.state = 'pre-cut'
                        if (result?.message) {
                            this.Notifications.invalidUrl.isShown = true
                            this.Notifications.invalidUrl.text = result.message
                        } else {
                            this.Notifications.connectionError.isShown = true
                        }
                        setTimeout(() => {
                            if (result?.message) {
                                this.Notifications.invalidUrl.isShown = false
                                this.Notifications.invalidUrl.text = 'Enter a valid Url'
                            } else {
                                this.Notifications.connectionError.isShown = false
                            }
                        }, 3000)
                    }
                } catch (error) {
                    // console.log(error);                        
                }
            } else {
                this.Notifications.invalidUrl.isShown = true
                setTimeout(() => {
                    this.Notifications.invalidUrl.isShown = false
                }, 3000)
            }
        }
    },
})