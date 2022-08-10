const qS = (el) => document.querySelector(el);
const qSAll = (el) => document.querySelectorAll(el);

// Seleção dos Elementos HTML
let tela = qS(".tela");
let textoSeuVoto = qS(".tela--cima-esquerda-voto h3");
let cargo = qS(".tela--cima-esquerda-cargo h2");
let descricao = qS(".tela--cima-esquerda-info");
let fotos = qS(".tela--cima-direita");
let fotoTitular = qS(".imagem-titular img");
let legendaTitular = qS(".imagem-titular h3");
let fotoVice = qS(".imagem-vice img");
let legendaVice = qS(".imagem-vice h3");
let aviso = qS(".tela--baixo");
let numeros = qS(".tela--cima-esquerda-num");
let botoes = qSAll("[data-number]");

// Definição das variáveis
let etapaAtual = 0;
let numero = "";
let votoBranco = false;
let votos = [];

// Função para iniciar o funcionamento da Urna
let comecarEtapa = () => {
  let etapa = etapas[etapaAtual];
  let numeroHtml = "";
  numero = "";
  votoBranco = false;
  for (let i = 0; i < etapa.digitos; i++) {
    if (i === 0) {
      numeroHtml = "<div class='num digitar'></div>";
    } else {
      numeroHtml += "<div class='num'></div>";
    }
  }
  textoSeuVoto.style.display = "none";
  cargo.innerHTML = etapa.cargo;
  numeros.style.display = "flex";
  numeros.innerHTML = `Número: ${numeroHtml}`;
  descricao.innerHTML = "";
  fotos.style.display = "none";
  aviso.style.display = "none";
};

// Função para atualizar a tela da Urna
let attInterface = () => {
  let etapa = etapas[etapaAtual];
  let candidato = etapa.candidatos.filter((item) => {
    if (item.numero === numero) {
      return true;
    } else {
      return false;
    }
  });
  if (candidato.length > 0) {
    candidato = candidato[0];
    textoSeuVoto.style.display = "flex";
    descricao.style.display = "flex";
    fotos.style.display = "flex";
    aviso.style.display = "block";
    if (etapaAtual === 0) {
      descricao.innerHTML = `<div class="info--nome">Nome: ${candidato.nome}</div>
    <div class="info--partido">Partido: ${candidato.partido}</div>`;
      fotoTitular.src = `./_assets/_media/${candidato.img[0].url}`;
      legendaTitular.innerHTML = candidato.img[0].legenda;
      qS(".imagem-vice").style.display = "none";
    } else if (etapaAtual === 1) {
      descricao.innerHTML = `<div class="info--nome">Nome: ${candidato.nome}</div>
    <div class="info--partido">Partido: ${candidato.partido}</div>
    <div class="info--vice">Vice: ${candidato.vice}</div>`;
      qS(".imagem-vice").style.display = "block";
      fotoTitular.src = `./_assets/_media/${candidato.img[0].url}`;
      legendaTitular.innerHTML = candidato.img[0].legenda;
      fotoVice.src = `./_assets/_media/${candidato.img[1].url}`;
      legendaVice.innerHTML = candidato.img[1].legenda;
    }
  } else {
    textoSeuVoto.style.display = "flex";
    aviso.style.display = "block";
    descricao.style.display = "flex";
    descricao.innerHTML = '<div class="aviso--voto"><h1>VOTO NULO</h1></div>';
  }
};

// Preencher a tela com os números clicando na urna
botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    let elNumero = qS(".num.digitar");
    if (elNumero !== null) {
      elNumero.innerHTML = botao.dataset.number;
      numero = `${numero}${botao.dataset.number}`;
      elNumero.classList.remove("digitar");
      if (elNumero.nextElementSibling !== null) {
        elNumero.nextElementSibling.classList.add("digitar");
      } else {
        attInterface();
      }
    }
  });
});

// Preencher a tela com os números digitados no teclado
document.body.addEventListener("keyup", (key) => {
  let elNumero = qS(".num.digitar");
  let numPad = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  if (numPad.includes(key.key)) {
    if (elNumero !== null) {
      elNumero.innerHTML = key.key;
      numero = `${numero}${key.key}`;
      elNumero.classList.remove("digitar");
      if (elNumero.nextElementSibling !== null) {
        elNumero.nextElementSibling.classList.add("digitar");
      } else {
        attInterface();
      }
    }
  }
});

// Função para botão Branco
let branco = () => {
  if (numero === "") {
    votoBranco = true;
    textoSeuVoto.style.display = "flex";
    numeros.style.display = "none";
    descricao.innerHTML =
      '<div class="aviso--voto"><h1>VOTO EM BRANCO</h1></div>';
    aviso.style.display = "block";
  } else {
    alert(
      "Para votar em BRANCO o campo de voto deve estar vazio. Aperte CORRIGE para apagar o campo de voto."
    );
  }
};

qS(".botao--branco").addEventListener("click", branco);

// Função para botão Corrige
let corrige = () => {
  comecarEtapa();
};

qS(".botao--corrige").addEventListener("click", corrige);

document.body.addEventListener("keyup", (key) => {
  if (key.key === "Backspace") {
    corrige();
  }
});

// Função para botão Confirma
let confirma = () => {
  let etapa = etapas[etapaAtual];
  let confirmaVoto = false;
  if (votoBranco === true) {
    confirmaVoto = true;
    playSound = () => {
      let audio = qS("[data-sound='confirma']");
      audio.play();
    };
    playSound();
    votos.push({
      etapa: etapas[etapaAtual].cargo,
      voto: "Branco",
    });
  } else if (numero.length === etapa.digitos) {
    confirmaVoto = true;
    votos.push({
      etapa: etapas[etapaAtual].cargo,
      voto: numero,
    });
  }
  if (confirmaVoto === true) {
    etapaAtual++;
    if (etapas[etapaAtual] !== undefined) {
      comecarEtapa();
      playSound = () => {
        let audio = qS("[data-sound='confirma']");
        audio.play();
      };
      playSound();
    } else {
      tela.innerHTML = '<div class="aviso--grande"><h1>FIM</h1></div>';
      playSound = () => {
        let audio = qS("[data-sound='confirmaFim']");
        audio.play();
      };
      playSound();
      console.log(votos);
      setTimeout(
        (reload = () => {
          document.location.reload(false);
        }),
        5000
      );
    }
  }
};

qS(".botao--confirma").addEventListener("click", confirma);

document.body.addEventListener("keyup", (key) => {
  if (key.key === "Enter") {
    confirma();
  }
});

// Acionar a função para iniciar a Urna
comecarEtapa();
