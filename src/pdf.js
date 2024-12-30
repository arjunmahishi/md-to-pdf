import html2pdf from 'html2pdf.js';

const getPDF = () => {
  const body = document.querySelector("body").cloneNode(true);
  const container = document.querySelector("#main-container").cloneNode(true);
  const preview = document.querySelector("#preview").cloneNode(true);

  // remove all the children of body and container
  // add the container to the body
  // add the preview to the container
  body.innerHTML = "";
  container.innerHTML = "";
  body.appendChild(container);
  container.appendChild(preview);

  // the preview needs to be full width or only the left half of the page will be occupied
  // in the pdf
  preview.classList.remove("w-1/2");
  preview.hidden = false;

  const opt = {
    filename: 'markdown.pdf',
    margin: [0, document.querySelector('#margin').value], // [vertical, horizontal] in mm
    image: { type: 'jpeg', quality: 1 },
    jsPDF: {
      orientation: 'portrait',
      format: document.querySelector('#page-size').value,
      quality: 1,
    },
  }

  return html2pdf().set(opt).from(body);
}

export const renderPDFPreview = () => {
  getPDF().toPdf().get('pdf').then(pdf => {

    const blob = pdf.setFontSize("200px").output('blob');
    const url = URL.createObjectURL(blob);

    document.querySelector("#preview-iframe").src = `${url}#toolbar=1&navpanes=0&scrollbar=1`;
  });
}

export const downloadPDF = () => {
  getPDF().save();
}

