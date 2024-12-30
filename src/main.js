import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { marked } from "marked";
import { renderers } from "./marked-renderers";
import { renderPDFPreview, downloadPDF } from "./pdf";

import './style.css';

marked.use({
  gfm: true,
  renderer: renderers,
})

const base = '/md-to-pdf';
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
    const response = await fetch(`${base}/README.md`);
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
