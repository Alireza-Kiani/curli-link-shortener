const app = new Vue({
    el: '#app',
    data: () => ({
        inputLink: '',
        fetching: false,
        shortenedLink: null,
        validUrl: null
    }),
    methods: {
        async shorten () {
            if (validator.isURL(this.inputLink)){
                this.fetching = true
                const response = await fetch('https://dumas.ir/shortener', {
                    method: 'post',
                    body: JSON.stringify({
                        link: this.inputLink
                    }),
                    headers: {
                        'content-type': 'Application/JSON'
                    },
                    redirect: 'follow'
                })
                const result = await response.json()
                this.fetching = false
                this.shortenedLink = 'https://dumas.ir/' + result.shortlink
            }
        },
        copyToClipBoard () {
            if (this.shortenedLink !== null) {
                const tempInput = document.createElement('input')
                tempInput.setAttribute('id', 'temp')
                tempInput.setAttribute('value', this.shortenedLink)
                // tempInput.style.display = 'none'
                tempInput.value = this.shortenedLink
                document.body.appendChild(tempInput)
                tempInput.select()
                document.execCommand('copy')
                document.getElementById('temp').remove()
            }
        },
        checkUrl(){
            if (this.inputLink !== ''){
                this.validUrl = validator.isURL(this.inputLink)
            }
        }
    },
})
