async function registerSW() {


    if ('serviceWorker' in navigator) {


        try {
            await navigator.serviceWorker.register('/service-worker.js');


        } catch (e) {
            alert('ServiceWorker registration failed. Sorry about that.');


        }
    } else {
        document.querySelector('.alert').removeAttribute('hidden');


    }
}
window.addEventListener('load', (e) => {
    registerSW();
});

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
                const response = await fetch('/shortener', {
                    method: 'post',
                    body: JSON.stringify({
                        link: this.inputLink
                    }),
                    headers: {
                        'content-type': 'application/json'
                    },
                    redirect: 'follow'
                })
                const result = await response.json()
                this.fetching = false
                this.shortenedLink = 'https://dumas.ir/' + result.shortLink
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
