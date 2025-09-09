pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

console.log(`PDF.js carregado: ${typeof pdfjsLib !== "undefined"}`);
console.log(`Worker configurado`, pdfjsLib.GlobalWorkerOptions);

async function carregarPDF(caminhoPDF) {
  try {
    console.log(`Carregando PDF:${caminhoPDF}`);
    const pdf = await pdfjsLib.getDocument(caminhoPDF).promise; //1
    return pdf;
  } catch (erro) {
    console.log(`Erro ao carregar:${erro}`);
    return null;
  } //catch pra biblioteca
}

/*
 1 - nao existe isso nativamente, e que algumas bibliotecas tem isso.

*/

async function iniciar() {
  try {
    const prontPDF = await carregarPDF(
      "./pdfs/86 - Volume 01 [Yen Press][Kobo_LNWNCentral].pdf"
    );

    renderizarPaginas(prontPDF);
  } catch (error) {
    console.log(`Erro ao carregar:${error}`);
  } //Ao tentar carregar o arquivo
}

async function renderizarPaginas(pdfdocument) {
  const Totalpaginas = pdfdocument.numPages;
  for (let numeroPagina = 1; numeroPagina < Totalpaginas; numeroPagina++) {
    let pagina = await pdfdocument.getPage(numeroPagina);

    //configura o t  amanho/zom
    const escala = 1.5; //1.0 = normal, 1.5 = 50% maior
    const viewport = pagina.getViewport({ scale: escala });

    //pega canvas
    const canvas = document.createElement("canvas");
    canvas.className = "pdfcanvas";
    console.log(canvas);
    const context = canvas.getContext("2d");

    //define Tamanho do canvas.
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    canvas.style.width = '50vw';
    canvas.style.height = 'auto';
    //renderiza
    await pagina.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    document.body.appendChild(canvas);

    // Delay de 1 segundo entre cada página
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("pagina renderizada");
}

iniciar();
