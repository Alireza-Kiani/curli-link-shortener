let canCreate = false;
$('#provided-url').val('');

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

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});


function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $('.tooltip').tooltip('dispose');
    Toast.fire({
        icon: 'success',
        title: 'Copied successfully!'
    })
    $temp.remove();
}

$('#shortener-btn').click(async function (e) {
    e.preventDefault();
    if (!canCreate) {
        return;
    }
    try {
        const res = await fetch('/shortener', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                link: $('#provided-url').val()
            }),
            redirect: 'follow'
        });
        const { shortLink } = await res.json();
        $('#generated-link')
            .html(`<h3>dumas.ir/${shortLink}</h3>`)
            .attr('href', `https://dumas.ir/${shortLink}`);
        Swal.fire({
            title: 'Your shortcut link is ready!',
            html: `<h3 onclick="copyToClipboard('#created-link')" id="created-link" data-placement="top" data-toggle="tooltip" title="Click and copy">dumas.ir/${shortLink}</h3>`,
            icon: 'success',
            focusConfirm: false,
            confirmButtonText: '<i class="fas fa-copy fa-2x"></i>',
            didOpen: function () {
                $('.swal2-confirm').tooltip({
                    placement: 'right',
                    title: 'Click and copy',
                    trigger: 'hover'
                }).click(function (e) {
                    copyToClipboard('#created-link');
                });
            }
        });
        $('[data-toggle="tooltip"]').tooltip();
    } catch (error) {
        console.log(error);
    }
});

$('#provided-url').keyup(function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $('#shortener-btn').click();
    }
});

$('#provided-url').on('input', function () {
    if (validator.isURL($(this).val())) {
        $('#provided-url:focus').css({
            'border': '3px solid #41f28b'
        });
        canCreate = true;
        return;
    } else if($(this).val() !== '') {
        $('#provided-url:focus').css({
            'border': '3px solid rgb(216, 47, 47)'
        });
    } else {
        $('#provided-url:focus').css({
            'border': '3px solid #ccc'
        });
    }
    canCreate = false;
});
