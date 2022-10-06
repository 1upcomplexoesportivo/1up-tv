var CDN = 'https://cdn.leonambernini.com.br/1up-tv/';
var CDN_IMAGES = CDN + 'images/';
var IMG_BRAND = CDN_IMAGES + '1up-brand.png';

// $('body').append(`<link rel="stylesheet" href="${CDN}css/style.css?a=${Math.random()}">`)

try {
    var AULAS = JSON.parse(localStorage.getItem("lb-tv")) || {};
} catch (error) {
    var AULAS = {};
}

function atualizaAulas(){
    AULAS = {};
    $.each($('#scheduleId option'), function(){
        var $this = $(this);
        var value = $this.val();
        var title = $this.text().split(' - ');
        if( value != '' ){
            AULAS[value] = title;
        }
    });
    localStorage.setItem("lb-tv", JSON.stringify(AULAS));
}

function prepareTV(){
            
    var professor_atual = ($('body > app-root > app-wodtv > div > div.header > div.bottom > div:nth-child(2)').text()).trim();

    // console.log(professor_atual)
    $('body').append(`
        <div class="lb-custom-tv">
            <div class="lb-custom-tv-loader">
                <div class="lb-custom-tv-p-center">
                    <img src="${IMG_BRAND}?a=${Math.random()}" alt="TV" />
                    <div class="lb-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
            </div>
            <div class="lb-custom-tv-tela-1">
                <!-- <img src="${CDN_IMAGES}${professor_atual}.png?a=${Math.random()}" width="" height="" class="lb-custom-tv-coach"> -->
                <div class="lb-custom-tv-p-top">
                    <img src="${IMG_BRAND}?a=${Math.random()}" width="" height="" class="lb-custom-tv-brand">

                    <div class="js-get-wod">
                        
                    </div>
                </div>
            </div>
            <div class="lb-custom-tv-tela-3">
                <iframe src="https://www.dropbox.com/s/di1232fqjkgn52k/tvexterna.html" id="lb-custom-tvexterna"></iframe>
            </div>
            <div class="lb-custom-tv-tela-4">
                <h2>CHECK-IN</h2>
                <div class="js-get-alunos">
                    
                </div>
            </div>

        </div>
    `);

    getInfo();
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
  
function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
}

function getInfo(){
    var ALUNOS = [];
    $.each( $('.listCheckIn .clientCheckIn'), function(){
        var $this = $(this);
        var img = $this.find('.card-img-top').attr('src');
        var name = $this.find('.card-body-student').text();

        ALUNOS.push({img, name})
    });

    var $infoWod = $('.info-wod');
    var INFO_WOD = [];
    var info_wod_index = 0;
    $.each( $infoWod, function(){
        var $content = $(this).closest('.content');
        var $title = $content.find('> h5.tag');
        INFO_WOD.push(`
            <div class="lb-info-wod-item" data-index="${info_wod_index}" style="display: none;">
                <h2>${$title.text()}</h2>
                ${$(this).html()}
            </div>
        `);

        info_wod_index++;
    });

    // INFO_WOD = $('.info-wod').html();

    if( !$('.lb-custom-tv').is(':visible') ){
        return false;
    }
    
    $('.js-get-wod').html(`<div class="lb-center-box"><div class="lb-custom-brand"></div> <div class="lb-info-wod-items">${INFO_WOD.join('')}</div></div>`);

    var ALUNOS_HTML = [];
    for( var x = 0; x < ALUNOS.length; x++ ){
        ALUNOS_HTML.push(`<li><img src="${ALUNOS[x]['img']}" width="30" height="30"> <span>${ALUNOS[x]['name']}</span></li>`)
    }

    $('.js-get-alunos').html(`
        <div class="lb-full-box">
            <ul class="lb-custom-tv-alunos">
                ${ALUNOS_HTML.join('')}
            </ul>
        </div>
    `);

    $('.lb-custom-tv-loader').fadeOut();
    $('.lb-info-wod-item').removeClass('active').hide();
    $('.lb-info-wod-item').first().addClass('active').fadeIn();
}

function atualizaHorarios(){
    if( !$('.container-wod').length ){
        return false;
    }

    if( !$('.lb-custom-tv').length ){
        prepareTV();
    }

    var data = new Date();
    var hora_atual_hora = parseInt(data.getHours());
    var hora_atual_minuto = parseInt(data.getMinutes());
    
    var aula_atual = null;

    try {
        var thisAulas = JSON.parse(localStorage.getItem("lb-tv")) || {};
    } catch (error) {
        var thisAulas = AULAS;
    }

    for( var aula_id in thisAulas ){
        var aula_inicio = new Date(`1/1/1999 ${thisAulas[aula_id][0]}:00`);
        var aula_termino = new Date(`1/1/1999 ${thisAulas[aula_id][1]}:00`);
        var hora_atual = new Date(`1/1/1999 ${hora_atual_hora}:${hora_atual_minuto}:00`);

        if( hora_atual >= aula_inicio && hora_atual < aula_termino ){
            aula_atual = aula_id;
        }
    }

    if( aula_atual != null ){
        var Tecnofit_WodTV = JSON.parse(sessionStorage.getItem('Tecnofit_WodTV'))
        if( Tecnofit_WodTV['scheduleId'] != aula_atual ){
            Tecnofit_WodTV['scheduleId'] = aula_atual;
            Tecnofit_WodTV['programDate'] = formatDate(data);
            // sessionStorage.setItem('lb-tv-professor', professor_atual);
            sessionStorage.setItem('Tecnofit_WodTV', JSON.stringify(Tecnofit_WodTV));
            document.location.reload(true);
        }else{
            // console.log('AGUARDAR...');
        }
        $('.lb-custom-tv').removeClass('tvexterna-ativa');
    }else{
        $('.lb-custom-tv').addClass('tvexterna-ativa2');
        // console.log('SEM AULA, AGUARDANDO PROXIMA AULA...');
    }
}

function atualizaQtdCheckins(){
    if( $('#amountList').length ){
        if( $('#amountList').val() != 25 ){
            $('#amountList').val(25);
        }
    }
}

function checkOptionsWods(){
    if( $('#showWod').length && !$('#showWod').is(':checked') )
        $('#showWod').closest('label').click();
    if( $('#showTechnical').length && !$('#showTechnical').is(':checked') )
        $('#showTechnical').closest('label').click();
    if( $('#showHeating').length && !$('#showHeating').is(':checked') )
        $('#showHeating').closest('label').click();
}

function eventos(){
    $(document).on('DOMNodeInserted DOMNodeRemoved', '#scheduleId', function() {
        atualizaAulas();
        atualizaQtdCheckins();
        checkOptionsWods();
    });

    document.addEventListener('keydown', function(e) {
        var $items = $('.lb-info-wod-item');
        var $itemActive = $('.lb-info-wod-item.active');
        var $elementToShow = null;
        var index = parseInt($itemActive.data('index'));

        var key = e.keyCode;
        if( key == 37 || key == 33 ){
            $elementToShow = ( $('.lb-info-wod-item').eq(++index).length ) ? $('.lb-info-wod-item').eq(++index) : $('.lb-info-wod-item').first();
        }else if( key == 39 || key == 34 ){
            $elementToShow = ( $('.lb-info-wod-item').eq(--index).length ) ? $('.lb-info-wod-item').eq(--index) : $('.lb-info-wod-item').last();
        }
        
        if( $elementToShow ){
            $items.removeClass('active').hide();
            $elementToShow.addClass('active').fadeIn();
        }
    });

    setTimeout( function(){
        if( $('.info-wod').length ){
            $('.lb-custom-tv').fadeIn();
        }
        getInfo();
        atualizaQtdCheckins();
        checkOptionsWods();
    }, 1000);

    setInterval( function(){
        atualizaHorarios();
    }, 1000);
}


atualizaHorarios();
eventos();