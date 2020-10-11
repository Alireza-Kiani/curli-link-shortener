let canCreate = false;
$('#provided-url').val('');
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
        const { shortlink } = await res.json();
        $('#generated-link')
            .html(`<h3>dumas.ir/${shortlink}</h3>`)
            .attr('href', `http://localhost:8080/${shortlink}`);
    } catch (error) {
        console.log(error);
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