import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { marked } from "marked";
import { renderers } from "./marked-renderers";
import html2pdf from 'html2pdf.js';
import './style.css';

marked.use({
  gfm: true,
  breaks: true,
  renderer: renderers,
})

const updateDebounceRate = 300; // milliseconds

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const updatePreview = debounce(() => {
  const markdown = editor.state.doc.toString();
  const html = marked(markdown);
  document.querySelector("#preview").innerHTML = html;
}, updateDebounceRate);

const editor = new EditorView({
  state: EditorState.create({
    doc: "test\n\n# test",
    extensions: [
      basicSetup,
      markdown(),
      EditorView.updateListener.of(updatePreview),
    ],
  }),
  parent: document.querySelector("#editor")
});

document.querySelector("#save-pdf").addEventListener("click", () => {
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


  html2pdf().from(body).toPdf().get('pdf').then(pdf => {
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url);
  });
});

document.getElementById('font').addEventListener('change', (e) => {
  document.querySelector('#preview').style = `font-family: ${e.target.value}`;
});
