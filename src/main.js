import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { marked } from "marked";
import { renderers } from "./marked-renderers";
import html2pdf from 'html2pdf.js';

import './style.css';

marked.use({
  gfm: true,
  renderer: renderers,
})

const editorUpdateDebounceRate = 1000; // milliseconds
const styleUpdateDebounceRate = 300; // milliseconds
const styleControlIDs = ['font-family', 'font-size', 'page-size', 'margin'];
let editor = null;

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

let lastHTML = '';
const editorUpdateHandler = debounce(() => {
  const markdown = editor.state.doc.toString();
  const html = marked(markdown);
  if (lastHTML === html) {
    return;
  }

  document.querySelector("#preview").innerHTML = html;
  renderPDFPreview();
  lastHTML = html;
}, editorUpdateDebounceRate);

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
    jsPDF: {
      orientation: 'portrait',
      format: document.querySelector('#page-size').value,
    },
  }

  return html2pdf().set(opt).from(body);
}

const renderPDFPreview = () => {
  getPDF().toPdf().get('pdf').then(pdf => {

    const blob = pdf.setFontSize("200px").output('blob');
    const url = URL.createObjectURL(blob);

    document.querySelector("#preview-iframe").src = `${url}#toolbar=1&navpanes=0&scrollbar=1`;
  });
}

const downloadPDF = () => {
  getPDF().save();
}

const styleUpdateHandler = debounce(() => {
  const preview = document.querySelector("#preview");
  const fontFamily = document.querySelector("#font-family").value;
  const fontSize = document.querySelector("#font-size").value;

  // TODO: find a way to add this directly via html2pdf / jsPDF
  preview.style = `font-family: ${fontFamily}; font-size: ${fontSize}px;`;

  renderPDFPreview();
}, styleUpdateDebounceRate);

// set up all the listeners below this

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/README.md');
    const markdownContent = await response.text();

    editor = new EditorView({
      parent: document.querySelector("#editor"),
      state: EditorState.create({
        doc: markdownContent,
        extensions: [
          basicSetup,
          markdown(),
          EditorView.updateListener.of(editorUpdateHandler),
        ],
      }),
    });
  } catch (error) {
    console.error('Error loading README.md:', error);
  }
});

styleControlIDs.forEach((id) => {
  document.getElementById(id).addEventListener('change', styleUpdateHandler);
});

document.querySelector('#save-pdf').addEventListener('click', () => {
  downloadPDF();
});
