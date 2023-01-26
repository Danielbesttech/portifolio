function envia_form_com_arquivo(img_load, pagina, form, campo_arquivo, div) {
  /*
  * 	ESSA FUNÇÃO RECEBE O FORMULÁRIO, PEGA TODOS OS SEUS ELEMENTOS E ENVIA PARA A PÁGINA DE DESTINO
  *
  * 	PARAMENTROS DE ENTRADA
  * 	{
  * 		img_load : string - imagem de loading
  * 		form - formulário que está sendo enviado
  * 		pagina - página para a qual os elementos irão
  * 		div - div onde a pagina de destino será apresentada
  * 	}
  */

  //	PROCEDIMENTO PARA VERIFICAÇÃO DOS CAMPOS DO FORMULÁRIO
  var varpost = valida_form(form);

  if (varpost != false) {
    $('#' + img_load).show();

    var formulario = document.getElementById(form);
    var formData = new FormData(formulario);

    $.ajax({
      url: pagina,
      type: 'POST',
      data: formData,
      success: function (data) {
        $('#' + img_load).hide();
        $('#' + div).html(data);
      },
      cache: false,
      contentType: false,
      processData: false,
      xhr: function () {  // Custom XMLHttpRequest
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
          myXhr.upload.addEventListener('progress', function () {
            /* faz alguma coisa durante o progresso do upload */
          }, false);
        }
        return myXhr;
      }
    });

  }

}

function chamar_pagina_var(img_load, pagina, varpost, div, success) {
  /*
   * 	ESSA FUNÇÃO SERVE PARA CHAMAR PÁGINAS DENTRO DAS DIVS ESPECIFICADAS
   *
   * 	PARAMETROS DE ENTRADA
   * 	{
   * 		img_load = imagem que será usada enquanto a pagina nao carrega
   * 		pagina = string com a url da pagina
   * 		varpost = variaveis post(opicional)
   * 		div = o ID da div onde sera carregada a pagina
   * 	}
   *
   */

  // cancela o timeout caso exista alguma página com o mesmo ativado

  if (success == undefined) { success = function (pagina) { $(div).html(pagina); $(img_load).css("display", "none"); }; }


  //	FUNÇÃO PARA QUE O IE FUNCIONE CORRETAMENTE
  $.ajaxSetup({
    cache: false
  });

  div = "#" + div;

  img_load = "#" + img_load;


  $(img_load).show();

  if (varpost != "") {

    $.ajax({
      type: 'post',
      data: varpost,
      url: pagina,
      success: success
    });
  }

  else {

    $(div).load(pagina, function () {
      $(img_load).css("display", "none");
      success();
    });
  }
}

// recebe ID do elemento a ser verificado
function verificaURL(id) {

  // expressão regular que verifica se a URL tem um formato padrão do youtube, exemplos validos:
  // https://www.youtube.com/watch?v=09R8_2nJtjg
  // https://www.youtube.com/channel/UCBVjMGOIkavEAhyqpxJ73Dw
  // https://youtube.com/c/aleArts
  // https://youtu.be/channel/
  // ou https://youtu.be/09R8_2nJtjg

  var re = new RegExp(/((http|https):\/\/)((www.youtube.com|youtube.com|youtu.be))(watch\?v=|channel\/|c\/|\/[A-Za-z0-9])/);
  var term = document.getElementById(id);

  if (!re.test(term.value)) {
    alert("Insira uma URL de video ou canal do Youtube valida.");

    // caso seja uma url invalida, remove URL incorreta
    term.value = '';
    return;
  }
}

var debounce = function (func, wait, immediate) {
  let timeout;
  return function (...args) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function scrollFunction(id_elm) {
  var botaoScroll = document.getElementById(id_elm);
  if (typeof botaoScroll !== "undefined" && botaoScroll != null) {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      botaoScroll.style.display = "block";
    } else {
      botaoScroll.style.display = "none";
    }
  }
}

function retornarAoTopo() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function envia_form(img_load, pagina, form, div, extra_field, success) {
  /*
    * 	ESSA FUNÇÃO RECEBE O FORMULÁRIO, PEGA TODOS OS SEUS ELEMENTOS E ENVIA PARA A PÁGINA DE DESTINO
    *
    * 	PARAMENTROS DE ENTRADA
    * 	{
    * 		img_load : string - imagem de loading
    * 		form - formulário que está sendo enviado
    * 		pagina - página para a qual os elementos irão
    * 		div - div onde a pagina de destino será apresentada
    * 	}
    */

  if (typeof extra_field == 'object') {
    $('#' + form).append(
      $('<input />').attr({
        'type': 'hidden'
        , 'value': extra_field.value
        , 'id': extra_field.name
        , 'name': extra_field.name
      })
    );
  } else if (typeof extra_field == 'array') {
    extra_field.forEach(function (e) {
      $('#' + form).append(
        $('<input />').attr({
          'type': 'hidden'
          , 'value': e.value
          , 'id': e.name
          , 'name': e.name
        })
      );
    });
  } else if (typeof extra_field == 'function') {
    success = extra_field;
  }

  //	PROCEDIMENTO PARA VERIFICAÇÃO DOS CAMPOS DO FORMULÁRIO
  var varpost = valida_form(form);

  if (varpost != false) {

    //  CHAMADA DA PÁGINA NA DIV SELECIONADA COM AS VARIÁVEIS POST SENDO PASSADAS COMO PARÂMETROS
    chamar_pagina_var(img_load, pagina, varpost, div, success);
  }

}


/**
 *	funcao que modifica o hash da página, disparando umevento  para que seja possivel navegar entre as páginas com os   botões voltar, avançar, etc
  a pagina passada como parametro será exibida na div definida na variavel "div_conteudo_principal"
  atenção, caso a varpost possua alguma variavel definida pelo parametro identificador (exemplo: 'id') a mesma será utilizada no hash,
  para que haja diferença caso a mesma pagina possa mostrar o conteúdo de acordo com essa variável

  @param pagina caminho dapagina para redirecionar
  @param varpost veriáveis serializadas
  @param identificador conteudo da varpost q seja o identificador desse redirecionamento, exemplo, um id

*/
function redirecionarPagina(pagina, varpost, identificador) {


  // cancela o timeout desejado

  if (varpost == undefined) { varpost = ''; }

  var index = (identificador != undefined) ? varpost.indexOf(identificador + '=') : -1;
  var id = '';
  var hash = '';

  if (index != -1) {
    var fimString = varpost.length;

    if (varpost.indexOf('&') != -1) {
      var temp = varpost.split('&');

      for (var k in temp) {
        if (temp[k].indexOf(identificador + '=') != -1) {
          var string = temp[k];
          break;
        }
      }
      fimString = varpost.indexOf(string) + string.length;
    }
    id = '?' + varpost.substring(index, fimString);
  }

  if (pagina.indexOf('index.php') != -1) {
    // retira o nome da pagina index do arquivo para exibir na barra de endereço
    hash = pagina.substring(0, pagina.indexOf('index.php'));
  }
  else {
    hash = pagina.substring(0, pagina.indexOf('.'));// retira a extensão do arquivo para exibir na barra de endereço
  }

  //bugfix pro IE- se o conteúdo que será carregado por ajax possuir algum activeX, a página é recarregada
  var agt = navigator.userAgent.toLowerCase();
  var reloadIE = false;
  if (agt.indexOf("msie") != -1) {
    if ($('#' + div_conteudo_principal).find('iframe').contents().find('body object').length > 0) {
      reloadIE = true;
    }
  }

  if (location.hash.replace(/^#/, '') == hash + id) {
    $('#loading').show();
    $('.fa-refresh').show();
    chamar_pagina_var(div_img_load_principal, pagina, varpost, div_conteudo_principal);
  }
  else {
    location.hash = hash + id;

  }

  $.Storage.saveItem('varpost_' + hash + id, varpost);

  if (reloadIE == true)
    location.reload();

}
/**
 *ESSA FUNÇÃO DEVE SER CHAMADA EM TODA PÁGINA QUE POSSUIR SEU CONTEÚDO MODIFICADO POR AJAX, UTILIZANDO A FUNÇÃO REDIRECIONAR_PAGINA
* onUrlChange - funcao se for definida será chamada com a url atual sendo informada. ex: urlChange(urlAtual);
*/
function adicionaEventoHashChange(img_loading, div, onUrlChange) {
  div_conteudo_principal = div;
  div_img_load_principal = img_loading;

  $(document).ready(function () {

    $(window).bind('hashchange', function (e) {

      url = location.hash.replace(/^#/, '');


      if (url != '') {
        //bugfix pro IE- se o conteúdo que será carregado por ajax possuir algum activeX, a página é recarregada
        var agt = navigator.userAgent.toLowerCase();
        var reloadIE = false;
        if (agt.indexOf("msie") != -1) {
          if ($('#' + div_conteudo_principal).find('iframe').contents().find('body object').length > 0)
            reloadIE = true;
        }

        varpost = $.Storage.loadItem('varpost_' + url);

        var continuar_redirect = true;

        if (onUrlChange != undefined && onUrlChange != null) {
          var continuar_redirect = onUrlChange(url);
        }

        location.hash = location.hash.replace(/^#/, '');

        if (continuar_redirect) {
          url = trataUrlHash(url);

          chamar_pagina_var(div_img_load_principal, url, varpost, div_conteudo_principal);

          if (reloadIE == true) {

            location.reload();
          }

        }
      }
      else {
        location.reload(); //entra aqui caso a página seja a index
      }

    });


    // quando a pagina for atualizada, a mesma será atualizada de acordo com a hash atual
    url = location.hash.replace(/^#/, '');

    if (url != '') {
      varpost = $.Storage.loadItem('varpost_' + url);

      if (varpost == false) {
        if (url.indexOf('?') != -1) {
          var index = url.indexOf('?');
          varpost = url.substring(index + 1, url.length);
        }
      }

      if (onUrlChange != undefined && onUrlChange != null) { onUrlChange(url); }

      url = trataUrlHash(url);
      chamar_pagina_var(div_img_load_principal, url, varpost, div_conteudo_principal);
    }

  });

}

function urlHashExists() {
  var url = location.hash.replace(/^#/, '');


  if (url == '')
    return false;
  else
    return true;
}

/**
* retorna o caminho da pagina php, de acordo com a url com hash fornecida
* se a url conter uma BARRA '/' no final, significa que após essa barra possui o index.php
*/
function trataUrlHash(url) {
  if (url.indexOf('?') != -1) {
    url = url.substring(0, url.indexOf('?'));
  }

  if (url.lastIndexOf('/') == url.length - 1) {
    url += 'index';
  }
  url += '.php';

  return url;
}


/**
 *Valida os campos do formulário (email, campos vazios, etc) e retorna o mesmo form como queryString ou false, se não for válido
*/
function valida_form(form) {
  // tratar campos do formulario
  var frm = document.getElementById(form);

  for (i = 0; i < frm.elements.length; i++) {
    if (frm.elements[i].className.indexOf("ignorar") == -1 && frm.elements[i].type != "file" &&
      frm.elements[i].type != "button") {
      if (isEmpty(frm.elements[i].value)) {
        $(frm.elements[i]).focus();
        $(frm.elements[i]).css("background", "#FFC6C7");


        console.log("Preecha todos os campos corretamente " + $(frm.elements[i]).attr('id'));

        return false;
      }
      else {
        $(frm.elements[i]).css("background", "#FFF");
      }

      if (frm.elements[i].name == "email" || $(frm.elements[i]).hasClass("email")) {
        if (!valida_email(frm.elements[i].value)) {
          //alert("Preecha o campo de email corretamente2 "+frm);
          $(frm.elements[i]).focus();
          $(frm.elements[i]).css("background", "#FFC6C7");

          return false;
        }
        else {
          $(frm.elements[i]).css("background", "#FFF");
        }
      }
      if (frm.elements[i].className.indexOf("no_special_characters") != -1) {
        if (temCaracterEspecial(frm.elements[i].value)) {
          $(frm.elements[i]).focus();
          $(frm.elements[i]).css("background", "#FFC6C7");

          //alert("Preecha todos os campos corretamente3");
          return false;
        }
        else {
          $(frm.elements[i]).css("background", "#FFF");
        }
      }
      if (frm.elements[i].className.indexOf("is_date") != -1) {
        if (!isDate(frm.elements[i].value)) {
          $(frm.elements[i]).focus();
          $(frm.elements[i]).css("background", "#FFC6C7");
          //alert("Preecha todos os campos corretamente4");
          return false;
        }
        else {
          $(frm.elements[i]).css("background", "#FFF");
        }
      }
      if (frm.elements[i].className.indexOf("is_time") != -1) {
        if (!isTime(frm.elements[i].value)) {
          $(frm.elements[i]).focus();
          $(frm.elements[i]).css("background", "#FFC6C7");
          //alert("Preecha todos os campos corretamente5");
          return false;
        }
        else {
          $(frm.elements[i]).css("background", "#FFF");
        }
      }

    }
  }


  form = "#" + form;
  return $(form).serialize();

}

function valida_email(valorCampo) {
  /*
    FUNÇÃO PARA VALIDAR O EMAIL
    SE O EMAIL N�O ESTIVER V�LIDO A FUNÇÃO RETORNA FALSE

    PARAMETRO: Valor do campo que será verificado
  */

  //	PESQUISA DOS CARACTERES @ E . (PONTO)
  if ((valorCampo.indexOf("@") == -1) || (valorCampo.indexOf(".") == -1)) {
    $('#email').addClass('background_red');
    return false;
  }
  else {
    return true;
  }
}

function isEmpty(pStrText) {
  try {
    var len = pStrText.length;
    var pos;
    var vStrnewtext = "";

    for (pos = 0; pos < len; pos++) {
      if (pStrText.substring(pos, (pos + 1)) != " ") {
        vStrnewtext = vStrnewtext + pStrText.substring(pos, (pos + 1));
      }
    }

    if (vStrnewtext.length > 0)
      return false;
    else
      return true;
  }
  catch (e) { return false; }
}
/**
 * função verifica se a string informada possui algum caracter especial (permissao apenas para'_', '-' e '.')
 */
function temCaracterEspecial(string) {
  var regex = new RegExp(/^[A-Za-z0-9_.-]+$/);

  if (regex.test(string)) {
    return false;
  }
  else {
    return true;
  }
}
/**
 *Verifica se um valor é uma data
*/
function isDate(valor) {

  var date = valor;
  var ardt = new Array;
  var ExpReg = new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}");
  ardt = date.split("/");
  if (date.search(ExpReg) == -1) {
    return false;
  }
  else if (((ardt[1] == 4) || (ardt[1] == 6) || (ardt[1] == 9) || (ardt[1] == 11)) && (ardt[0] > 30)) {
    return false;
  }
  else if (ardt[1] == 2) {
    if ((ardt[0] > 28) && ((ardt[2] % 4) != 0)) {
      return false;
    }
    if ((ardt[0] > 29) && ((ardt[2] % 4) == 0)) {
      return false;
    }
  }
  return true;
}
/**
 * Verifica se o texte está no formato de hora (HH:mm)
 */
function isTime(campo) {
  var regex = new RegExp(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);

  if (!regex.test(campo)) {
    return false;
  }
  else {
    return true;
  }
}
function preventSubmit() {
  $("form").keypress(function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      return false;
    }
  });
}
