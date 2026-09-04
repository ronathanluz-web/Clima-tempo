// 1) Encontra o botão que possui id="buscar"
const botaoBuscar = document.getElementById("buscar");

// 2) Liga o clique do botão à função buscarClima
botaoBuscar.addEventListener("click", buscarClima);

// 3) Esta função será executada a cada clique
function buscarClima(event) {

  // Evita que o formulário recarregue a página
  event.preventDefault();

  console.log("O botão foi clicado!");

  // Encontra o input com id="cidade"
  const campoCidade = document.getElementById("cidade");

  // .value pega o que o usuário digitou
  // .trim() remove espaços extras no início/fim
  const cidade = campoCidade.value.trim();

  console.log("Cidade digitada:", cidade);

  if (cidade === "") {
    alert("Digite o nome de uma cidade.");
    return;
  }

  // ============================================
  // CONFIGURAÇÃO DA API — Open-Meteo
  // ============================================

  const GEO_URL =
    "https://geocoding-api.open-meteo.com/v1/search";

  const CLIMA_URL =
    "https://api.open-meteo.com/v1/forecast";

  // 1) Descobre latitude e longitude da cidade
  const urlBusca =
    `${GEO_URL}?name=${encodeURIComponent(cidade)}` +
    `&count=1&language=pt&format=json`;

  fetch(urlBusca)

    .then(resposta => {

      if (!resposta.ok) {
        throw new Error("Erro ao procurar a cidade.");
      }

      return resposta.json();
    })

    .then(dadosCidade => {

      // Verifica se a cidade foi encontrada
      if (!dadosCidade.results || dadosCidade.results.length === 0) {
        throw new Error("Cidade não encontrada.");
      }

      const { latitude, longitude } = dadosCidade.results[0];

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      // 2) Usa latitude e longitude para consultar o clima
      const urlClima =
        `${CLIMA_URL}?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

      return fetch(urlClima);
    })

    .then(resposta => {

      if (!resposta.ok) {
        throw new Error("Não foi possível consultar o clima.");
      }

      return resposta.json();
    })

    .then(dadosClima => {

      console.log(dadosClima);

      // Pega os dados retornados pela API
      const temperatura =
        dadosClima.current.temperature_2m;

      const umidade =
        dadosClima.current.relative_humidity_2m;

      const vento =
        dadosClima.current.wind_speed_10m;

      // Encontra onde o resultado será exibido
      const resultado =
        document.getElementById("resultado");

      // Mostra os dados embaixo da pesquisa
      resultado.innerHTML = `
        <div class="card-clima">

          <h2>${cidade}</h2>

          <p>
             Temperatura:
            <strong>${temperatura} °C</strong>
          </p>

          <p>
             Umidade:
            <strong>${umidade}%</strong>
          </p>

          <p>
             Vento:
            <strong>${vento} km/h</strong>
          </p>

        </div>
      `;
    })

    .catch(erro => {

      console.error(erro);

      const resultado =
        document.getElementById("resultado");

      resultado.innerHTML = `
        <p>${erro.message}</p>
      `;
    });
}