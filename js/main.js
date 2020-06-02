"use strict";

var initFormaDudas = function initFormaDudas() {
    var TIPOS = { UNO: "uno", DOS: "dos" };
    var contForma = $("#forma-contenedor");
    var tipoForma = contForma.attr("data-tipoForma");

    var formaCampos = contForma.find('li').toArray().map(function (elem) {
        var contenedor = $(elem);
        var campo = contenedor.find('label, input, textarea').toArray().reduce(function (prev, curr, idx) {
            var tagName = curr.tagName.toLowerCase();
            var elem = $(curr);
            var esEtiqueta = tagName === 'label';

            return Object.assign(!esEtiqueta ? {
                input: elem,
                name: elem.prop("name"),
                tag: tagName,
                tipo: elem.attr("data-tipo")
            } : {
                label: elem,
                msjSpan: elem.find("span"),
                texto: elem.text().trim()
            }, prev);
        }, {});

        return Object.assign({
            valido: false,
            contenedor: contenedor
        }, campo);
    });

    var forma = $("#forma-contenedor");
    var msjForma = $("#forma-msj");
    var REGEX = {
        input: /^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü'\- ]+$/,
        textarea: /^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñÜü'".,;¿?¡!()\- ]+$/,
        correo: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    };
    var MENSAJES = {
        input: "Sólo usa vocales, consonantes, espacios y guiones medios.",
        correo: "El formato de correo no es valido.",
        textarea: "Sólo usa vocales, consonantes y signos de puntuación( \'\".,;¿?¡!\( \ ) )."
    };
    var widgetRecaptcha = grecaptcha.render('contenedor-captcha', {
        sitekey: "6LdwNxAUAAAAAHt3hbbY7THv2vV0klUfLGkfMHHN"
    });
    var showResponse = function showResponse(type, response) {
        return msjForma.html(response).addClass(type);
    };
    var isEmpty = function isEmpty(value) {
        var val = value.trim();

        return val === "" && val.length === 0;
    };

    var procesando = false;

    formaCampos.forEach(function (campo, idx) {
        if (campo.tag) {
            campo.input.change(function () {
                var valorCampo = campo.input.val();
                var tipo = campo.tipo;
                var isLlena = !isEmpty(valorCampo);
                var isCorrecto = REGEX[tipo].test(valorCampo);

                campo.valido = isLlena && isCorrecto;
                campo.label.removeClass('correcto error');
                campo.label.addClass(campo.valido ? "correcto" : "error").html(campo.valido ? campo.texto : MENSAJES[tipo]);

                campo.input[isLlena ? "addClass" : "removeClass"]("activo");
            }).val("");
        }
    });

    forma.submit(function (event) {
        event.preventDefault();

        var valido = formaCampos.map(function (campo) {
            return campo.valido;
        }).reduce(function (a, b) {
            return a && b;
        });

        formaCampos.forEach(function (campo) {
            if (campo.tag !== "select") {
                campo.msjSpan.html(!isEmpty(campo.input.val()) ? campo.texto : "Este campo no puede estar vacio");
            }
        });

        if (valido && !procesando) {
            procesando = !procesando;

            $.ajax({
                type: "POST",
                url: (tipoForma === TIPOS.DOS ? "mail.calidad" : "mail") + ".php\"",
                data: forma.serialize()
            }).done(showResponse.bind(null, "success")).fail(showResponse.bind(null, "fail"));
        }
    });
};

(function () {
    var slides = $("#galeria-destinos li");
    var btnAtras = $("#btn-atras");
    var btnAdelante = $("#btn-adelante");
    var numSlides = slides.length - 1;
    var DIRECCION = { ADELANTE: 'adelante', ATRAS: 'atras' };
    var TIEMPO_INTERVALO = 10000;    
    var TIEMPO_DELAY = 20000;
    var timer = null;

    var cambiarSlide = function () {
        var currIndex = 0;

        return function (direccion, cambioForzado) {
            var esAdelante = direccion === DIRECCION.ADELANTE;

            if (timer) {
                clearTimeout(timer);
            }

            currIndex = esAdelante ? currIndex + 1 : currIndex - 1;
            currIndex = currIndex < 0 ? numSlides : currIndex;
            currIndex = currIndex > numSlides ? 0 : currIndex;

            slides.removeClass("activo").eq(currIndex).addClass("activo");

            timer = setTimeout(cambiarSlide.bind(null, DIRECCION.ADELANTE, false), cambioForzado ? TIEMPO_DELAY : TIEMPO_INTERVALO);
        };
    }();

    slides.eq(0).addClass('activo');
    btnAtras.click(cambiarSlide.bind(null, DIRECCION.ATRAS, true));
    btnAdelante.click(cambiarSlide.bind(null, DIRECCION.ADELANTE, true));

    timer = setTimeout(cambiarSlide.bind(null, DIRECCION.ADELANTE, false), TIEMPO_DELAY);
})();

(function () {
    var slides = $("#galeria-principal li");
    var currIndex = 0;
    var rotarItems = function rotarItems() {
        slides.removeClass("activo").eq(currIndex).addClass("activo");
        currIndex = ++currIndex > slides.length - 1 ? 0 : currIndex;
        setTimeout(rotarItems, 3000);
    };

    if (slides.length) {
        slides.eq(0).addClass('activo');
        rotarItems();
    }
})();

(function () {
    var idxSeccionActiva = parseInt($('#contenedor-general').attr('data-seccion-activa'));

    console.log(idxSeccionActiva);

    var menuMovil = $('#menu-movil');
    var menuEscritorio = $('#secciones-header');
    var setsMenus = $([menuEscritorio.find('li'), menuMovil.find('li')]);
    var btnsMenuMovil = $('.btn-mostrar-menu-movil').add('.btn-cerrar-menu-movil');
    var menuVisible = false;

    setsMenus.each(function (idx, setBtns) {
        setBtns.eq(idxSeccionActiva).addClass('activo');
    });

    btnsMenuMovil.click(function () {
        menuMovil[menuVisible ? 'removeClass' : 'addClass']('activo');
        menuVisible = !menuVisible;
    });
})();